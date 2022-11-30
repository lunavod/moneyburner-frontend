import { noop } from 'lodash-es'
import { createElement, createFactory, Fragment, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { YMInitializer } from 'react-yandex-metrika'
import 'reflect-metadata'
import 'the-new-css-reset/css/reset.css'
import 'virtual:fonts.css'

import Context, { getContextValue } from './Context'
import App from './components/App'
import './index.css'
import './maidencss/index.css'

window._jsx = createElement
window._jsxFragment = Fragment

const main = (
  <StrictMode>
    <BrowserRouter>
      <Context.Provider value={getContextValue()}>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </StrictMode>
)

const rootElement = document.getElementById('root')
ReactDOM.render(main, rootElement)
