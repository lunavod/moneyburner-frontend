/* eslint-disable unused-imports/no-unused-vars */
/// <reference lib="dom" />

interface ImportMetaEnv {
  [key: string]: any
  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
  SSR: boolean
}
// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.less' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.styl' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.stylus' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.pcss' {
  const classes: CSSModuleClasses
  export default classes
}

// CSS
declare module '*.css' {
  const css: string
  export default css
}
declare module '*.scss' {
  const css: string
  export default css
}
declare module '*.sass' {
  const css: string
  export default css
}
declare module '*.less' {
  const css: string
  export default css
}
declare module '*.styl' {
  const css: string
  export default css
}
declare module '*.stylus' {
  const css: string
  export default css
}
declare module '*.pcss' {
  const css: string
  export default css
}

// Built-in asset types
// see `src/constants.ts`

// images
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}
declare module '*.ico' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.avif' {
  const src: string
  export default src
}

// media
declare module '*.mp4' {
  const src: string
  export default src
}
declare module '*.webm' {
  const src: string
  export default src
}
declare module '*.ogg' {
  const src: string
  export default src
}
declare module '*.mp3' {
  const src: string
  export default src
}
declare module '*.wav' {
  const src: string
  export default src
}
declare module '*.flac' {
  const src: string
  export default src
}
declare module '*.aac' {
  const src: string
  export default src
}

// fonts
declare module '*.woff' {
  const src: string
  export default src
}
declare module '*.woff2' {
  const src: string
  export default src
}
declare module '*.eot' {
  const src: string
  export default src
}
declare module '*.ttf' {
  const src: string
  export default src
}
declare module '*.otf' {
  const src: string
  export default src
}

// other
declare module '*.wasm' {
  const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Exports>
  export default initWasm
}
declare module '*.webmanifest' {
  const src: string
  export default src
}
declare module '*.pdf' {
  const src: string
  export default src
}
declare module '*.txt' {
  const src: string
  export default src
}

// web worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module '*?sharedworker' {
  const sharedWorkerConstructor: {
    new (): SharedWorker
  }
  export default sharedWorkerConstructor
}

declare module '*?raw' {
  const src: string
  export default src
}

declare module '*?url' {
  const src: string
  export default src
}

declare module '*?inline' {
  const src: string
  export default src
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_URL: string
  readonly VITE_TEMP_TOKEN: string
  readonly VITE_YM_ID?: string
  // readonly VITE_WS_URL: string
  // readonly VITE_TASK_TRIGGER_SECRET_WORD: string
  // readonly VITE_SENTRY_DSN?: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare namespace React {
  interface Attributes {
    styleName?: string | undefined
  }
  interface HTMLAttributes<T> {
    styleName?: string | undefined
  }
  interface SVGAttributes<T> {
    styleName?: string | undefined
  }
}

declare module 'colorthief' {
  export default class ColorThief {
    getColor(img: HTMLImageElement): [number, number, number]
  }
}
