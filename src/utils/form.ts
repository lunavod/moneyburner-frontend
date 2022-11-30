import { toJS } from 'mobx'

import { observableStore } from '../pages/useMobx'

type PropertiesOfType<T, I> = {
  [K in keyof T]: T[K] extends I ? K : never
}[keyof T]

export type SelectVariant = {
  name: string
  code: string
}

@observableStore
export default class FormState<F extends Record<string, any>> {
  form: F
  initialValues: F
  lastUpdate: Date

  constructor(form: F) {
    this.form = form
    this.initialValues = toJS(form)
  }

  listeners: (() => any)[] = []

  addListener(func: () => any) {
    if (this.listeners.includes(func)) return
    this.listeners.push(func)
  }

  removeListener(func: () => any) {
    if (!this.listeners.includes(func)) return
    this.listeners.splice(this.listeners.indexOf(func), 1)
  }

  private emitUpdate() {
    this.lastUpdate = new Date()
    this.listeners.forEach((func) => func())
  }

  reset(newValues?: F) {
    this.form = newValues ?? { ...toJS(this.initialValues) }
    this.emitUpdate()
  }

  set<K extends keyof F>(prop: K, value: F[K]) {
    this.form[prop] = value
    this.emitUpdate()
  }

  select(prop: PropertiesOfType<F, SelectVariant[]>, value: SelectVariant) {
    if (this.form[prop].includes(value)) return
    this.form[prop].push(value)
    this.emitUpdate()
  }

  unselect(prop: PropertiesOfType<F, SelectVariant[]>, value: SelectVariant) {
    if (!this.form[prop].find((v: SelectVariant) => v.code === value.code))
      return
    this.form[prop].splice(
      this.form[prop].findIndex((v: SelectVariant) => v.code === value.code),
      1,
    )
    this.emitUpdate()
  }

  setStringList(
    prop: PropertiesOfType<F, string[]>,
    rawProp: PropertiesOfType<F, string>,
    value: string,
  ) {
    const arr = value
      .replaceAll(',', ' ')
      .replace(/ {2,}/g, ' ')
      .split(' ')
      .filter((i) => !!i)
    // @ts-ignore
    this.form[rawProp] = value
    // @ts-ignore
    this.form[prop] = arr.length === 1 && arr[0] === '' ? [] : arr
    this.emitUpdate()
  }

  getSelectProps(prop: PropertiesOfType<F, SelectVariant[]>) {
    return {
      // @ts-ignore
      onChange: (variants: SelectVariant[]) => this.set(prop, variants),
      select: (variant: SelectVariant) => this.select(prop, variant),
      unselect: (variant: SelectVariant) => this.unselect(prop, variant),
      selected: this.form[prop],
    }
  }

  getSingleSelectProps(prop: PropertiesOfType<F, string>) {
    return {
      // @ts-ignore
      onChange: (value: string) => this.set(prop, value),
      selected: this.form[prop],
    }
  }

  getCheckboxProps(prop: PropertiesOfType<F, boolean>) {
    return {
      checked: this.form[prop],
      // @ts-ignore
      onClick: (val: boolean) => this.set(prop, val),
    }
  }

  getInputProps(prop: PropertiesOfType<F, string>) {
    return {
      value: this.form[prop],
      onChange: (s: string) => {
        // @ts-ignore
        this.set(prop, s)
      },
    }
  }

  getNumberInputProps(prop: PropertiesOfType<F, number>) {
    return {
      value: this.form[prop],
      onChange: (s: number) => {
        // @ts-ignore
        this.set(prop, s)
      },
    }
  }

  isDifferent(form: F) {
    return JSON.stringify(form) !== JSON.stringify(toJS(this.form))
  }
}
