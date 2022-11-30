const KVIN = require('kvin')
KVIN.tune = 'speed'

const fs = require('fs')
const path = require('path')
const express = require('express')
const { createServer: createViteServer } = require('vite')
const prettier = require('prettier')

require('dotenv').config()
const dev = process.env.NODE_ENV !== 'production'

const compression = require('compression')

const Piscina = require('piscina')

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js'),
})

async function createServer() {
  const app = express()
  app.use(compression())

  let vite

  if (dev) {
    vite = await createViteServer({
      server: { middlewareMode: 'ssr' },
    })
    app.use(vite.middlewares)
  }
  app.use('/assets', express.static(path.join(__dirname, 'dist/client/assets')))
  app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')))
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    let template = fs.readFileSync(
      path.resolve(
        __dirname,
        process.env.NODE_ENV === 'production'
          ? 'dist/client/index.html'
          : 'index.html',
      ),
      'utf-8',
    )
    if (dev) template = await vite.transformIndexHtml(url, template)

    try {
      // 1. Read index.html

      let render
      if (process.env.NODE_ENV === 'production') {
        const { render: r } = require('./dist/server/entry-server.js')
        render = async (r) =>
          JSON.parse(
            await piscina.run({
              headers: r.headers,
              originalUrl: r.originalUrl,
            }),
          )
      } else {
        r = await vite.ssrLoadModule('/src/entry-server.tsx')
        render = r.render
      }
      const {
        content: appHtml,
        exports,
        helmet,
        code,
        redirectTo,
      } = await render(req)

      let html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-meta-->`,
          `${helmet.title.toString()}\n${helmet.meta.toString()}\n${helmet.link.toString()}`,
        )
        .replace(
          `<!--ssr-exports-->`,
          '<script> globalThis.SSR_EXPORTS = ' +
            KVIN.serialize(exports) +
            '</script>',
        )

      if (redirectTo) {
        console.log(`Redirect from ${req.url} to ${redirectTo}`)
        res = res.redirect(code, redirectTo)
      }

      res
        .status(code ?? 200)
        .set({ 'Content-Type': 'text/html' })
        .end(html)
    } catch (e) {
      console.error(e)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    }
  })

  app.listen(Number(process.env.PORT ?? 8080))
}
process.on('unhandledRejection', (err) => console.error('Unhandled!', err))
createServer()
