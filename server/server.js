import Express from 'express'
import path from 'path'
import render from './render'
import devMiddleware from './dev-middleware'

const app = new Express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'
const USE_NODE_MODULES = !!process.env.USE_NODE_MODULES || false
const USE_SOURCE = process.argv.includes('--source')

app.set('views', path.join(__dirname))
app.set('view engine', 'ejs')

app.get('/', render)

if (USE_NODE_MODULES) {
  app.use('/node_modules', Express.static(path.join(__dirname, '..', '/node_modules/')))
}

if (NODE_ENV == 'development') {
  devMiddleware(app)
}
else {
  app.use('/static', Express.static(path.join(__dirname, '..', 'dist')))
}

app.use('/public', Express.static(path.join(__dirname, '..', 'public')))

if (USE_SOURCE) {
  const PATH_TO_UPLOADCARE_WIDGET = process.env.PATH_TO_UPLOADCARE_WIDGET || '..'

  app.use('/script_base', Express.static(path.join(PATH_TO_UPLOADCARE_WIDGET, 'uploadcare-widget', 'pkg', 'latest')))
}

app.listen(PORT, (error) => {
  if (error) {
    console.error(error)
  }
  else {
    console.info(`Listening on port ${PORT}. http://localhost:${PORT}`)
  }
})
