import { Request as Req } from 'express'
// @ts-ignore
import document from 'global/document'
// @ts-ignore
import window from 'global/window'
import { noop } from 'lodash-es'
import MobileDetect from 'mobile-detect'
import { enableStaticRendering, observer } from 'mobx-react-lite'
import React, { createElement, Fragment } from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom/server'
import 'reflect-metadata'
import { v4 } from 'uuid'

import Context from './Context'
import StatusCodeContext from './StatusCodeContext'
import App from './components/App'

export async function render(req: Req) {
  const url = req.originalUrl.split('?')[0]

  const cookies: Record<string, string> = {}
  req.headers['cookie']?.split('; ').forEach((s) => {
    const [key, value] = s.split('=')
    cookies[key] = value
  })

  if (cookies.token) window.__TOKEN = cookies.token
  else window.__TOKEN = undefined

  const md = new MobileDetect(req.headers['user-agent'] as string)
  globalThis.IS_MOBILE = !!md.mobile()

  enableStaticRendering(true)
  globalThis.SSR_MODE = true
  globalThis.window = window
  globalThis.window.CustomUserAgent = req.headers['user-agent']
  console.log(req.query)
  const s = new URLSearchParams(req.query as Record<string, string>).toString()
  globalThis.location = {
    origin: import.meta.env.VITE_FRONTEND_URL,
    pathname: url,
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    search: s ? '?' + s : '',
    hash: '',
    href: import.meta.env.VITE_FRONTEND_URL + url,
    protocol: import.meta.env.VITE_FRONTEND_PROTOCOL,
    reload: noop,
    ancestorOrigins: [] as unknown as DOMStringList,
    assign: noop,
    replace: noop,
    toString() {
      return this.href + this.search + this.hash
    },
  }
  globalThis.document = document
  globalThis.document.cookie = req.headers.cookie ?? ''
  globalThis.window._jsx = createElement
  globalThis.window._jsxFragment = Fragment

  const contextValue: {
    requests: Record<string, Promise<any>>
    complete: Record<string, any>
    exports: Record<string, any>
  } = { requests: {}, complete: {}, exports: {} }

  const codeContextValue = { code: 200, redirectTo: null }

  renderToString(
    <StatusCodeContext.Provider value={codeContextValue}>
      <Context.Provider value={contextValue}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Context.Provider>
      ,
    </StatusCodeContext.Provider>,
  )
  Helmet.renderStatic()

  const exports: Record<string, any> = {}

  for (const [key, value] of Object.entries(contextValue.requests)) {
    contextValue.complete[key] = await value

    if (contextValue.complete[key].export) {
      exports[key] = contextValue.complete[key].export()
    }
  }

  contextValue.requests = {}
  const content = renderToString(
    <StatusCodeContext.Provider value={codeContextValue}>
      <Context.Provider value={contextValue}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Context.Provider>
    </StatusCodeContext.Provider>,
  )
  const h2 = Helmet.renderStatic()

  Object.entries(h2).forEach(
    ([key, value]) => (h2[key as keyof typeof h2] = value.toString()),
  )
  return {
    content,
    exports,
    helmet: h2,
    code: codeContextValue.code,
    redirectTo: codeContextValue.redirectTo,
  }
}
