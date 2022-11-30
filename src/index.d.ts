declare global {
  interface Window {
    _jsx: any
    _jsxFragment: any
    SSR_EXPORTS: any
    __TOKEN: any
  }

  var SSR_MODE: boolean
  var SSR_EXPORTS: any
  var IS_MOBILE: boolean
  var CustomUserAgent: string | undefined

  var ym: undefined | ((id: number, methodName: string, ...args: any) => any)

  namespace JSX {
    interface IntrinsicElements {
      'baka-editor': any
      'baka-mention': any
      'baka-link': any
    }
  }
}

export {}
