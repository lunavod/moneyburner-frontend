import { isEqual } from 'lodash-es'
import { $mobx, action, isObservable, makeObservable } from 'mobx'
import React, { useState, useEffect, useContext, useId } from 'react'
import { v4 } from 'uuid'

import Context from '../Context'

export abstract class MobxStore<P = never> {
  _initialized = false
  _initData?: P

  export() {
    return {}
  }

  import(data: any) {
    return
  }

  abstract initialize(data?: P, preloaded?: boolean): any | Promise<any>

  async _initialize(data?: P, preloaded?: boolean) {
    if (this._initialized && isEqual(this._initData, data)) return
    this._initData = data
    const tmp = await Promise.resolve(this.initialize(data, preloaded))
    action(() => (this._initialized = true))
    return tmp
  }

  waitFor(func: () => boolean, timeout: number, label?: string) {
    const id = v4()
    console.time(`waiting ${id} ${label}`)
    var start = Date.now()
    console.log('waiting', timeout, label)
    const wait = (
      resolve: (...args: any[]) => any,
      reject: (...args: any[]) => any,
    ) => {
      if (func()) {
        console.timeEnd(`waiting ${id} ${label}`)
        resolve()
      } else if (
        timeout &&
        Date.now() - start >= timeout &&
        globalThis.SSR_MODE
      ) {
        reject(new Error('timeout of ' + label))
      } else setTimeout(wait.bind(this, resolve, reject), 30)
    }
    return new Promise(wait)
  }
}

export function useMobx<T extends MobxStore<P>, P = never>(
  store: T,
  data?: P,
  code?: string,
): T {
  const ctx = useContext<{
    requests: Record<string, Promise<any>>
    complete: Record<string, T>
    exports: Record<string, any>
  }>(Context)
  const [state, setState] = useState(store)

  // console.log('Exports:', ctx.exports)

  const deps =
    data instanceof Array
      ? [state._initialized, ...data]
      : [state._initialized, data]

  const [cached, setCached] = useState<any[]>([])
  if (!isEqual(cached, deps)) {
    setCached(deps)
    if (ctx.requests && code) {
      if (ctx.complete[code]) {
        // if (code === 'catalog') console.warn('a', code, deps, cached)
        setState(ctx.complete[code])
        return ctx.complete[code]
      } else {
        // if (code === 'catalog') console.warn('b', code, deps, cached)
        if (code && ctx.exports[code]) state.import(ctx.exports[code])
        ctx.requests[code] = state
          ._initialize(data, code && ctx.exports[code])
          .then(() => state)
      }
    } else {
      // if (code === 'catalog') console.warn('c', code, deps, cached)
      if (code && ctx.exports[code]) state.import(ctx.exports[code])
      state._initialize(data, code && ctx.exports[code])
    }
  }

  return state
}

export function observableStore<T extends { new (...args: any[]): any }>(
  constructor: T,
) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      makeSimpleAutoObservable(this)
    }
  }
}

const annotationsSymbol = Symbol('annotationsSymbol')
const objectPrototype = Object.prototype

/**
 * A purposefully-limited version of `makeAutoObservable` that supports subclasses.
 *
 * There is valid complexity in supporting `makeAutoObservable` across disparate/edge-casey
 * class hierarchies, and so mobx doesn't support it out of the box. See:
 * https://github.com/mobxjs/mobx/discussions/2850#discussioncomment-1203102
 *
 * So this implementation adds a few limitations that lets us get away with it. Specifically:
 *
 * - We always auto-infer a key's action/computed/observable, and don't support user-provided config values
 * - Subclasses should not override parent class methods (although this might? work)
 * - Only the "most child" subclass should call `makeSimpleAutoObservable`, to avoid each constructor in
 *   the inheritance chain potentially re-decorating keys.
 *
 * See https://github.com/mobxjs/mobx/discussions/2850
 */
export function makeSimpleAutoObservable(target: any): void {
  // These could be params but we hard-code them
  const overrides = {} as any
  const options = {}

  // Make sure nobody called makeObservable/etc. previously (eg in parent constructor)
  if (isObservable(target)) {
    throw new Error('Target must not be observable')
  }

  let annotations = target[annotationsSymbol]
  if (!annotations) {
    annotations = {}
    let current = target
    while (current && current !== objectPrototype) {
      Reflect.ownKeys(current).forEach((key) => {
        if (key === $mobx || key === 'constructor') return
        annotations[key] = !overrides
          ? true
          : key in overrides
          ? overrides[key]
          : true
      })
      current = Object.getPrototypeOf(current)
    }
    // Cache if class
    const proto = Object.getPrototypeOf(target)
    if (proto && proto !== objectPrototype) {
      Object.defineProperty(proto, annotationsSymbol, { value: annotations })
    }
  }

  return makeObservable(target, annotations, options)
}
