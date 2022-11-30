const { render } = require('./dist/server/entry-server.js')

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => null,
}
module.exports = async (workerData) => {
  console.log(workerData)
  let data
  try {
    data = await render(workerData)
  } catch (error) {
    console.log('Render error:', workerData.originalUrl, 'Error', error)
    throw new Error('Worker error')
  }
  // console.log('Data:', data)
  return JSON.stringify(data)
}
