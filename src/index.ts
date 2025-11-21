import { app, port } from './app'

const main = () => {
  app.listen(port, () => {
    console.log('🚀 Servidor corriendo en http://localhost:' + port)
  })
}

main()