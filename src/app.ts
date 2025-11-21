import express, { Request, Response } from 'express'
import showRequests from './middleware/showRequest'
import cors from 'cors'
import path from 'path'
import authRouter from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import pacienteRoutes from './routes/pacienteRoutes'
import citaRoutes from './routes/citasRoutes'
import dssRoutes from './routes/dssRoutes'
import errorHanddler from './middleware/errorHanddler'

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(showRequests)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:5500'],
  exposedHeaders: ['token'],
  credentials: true
}))

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')))

app.get('/ping', (_req: Request, res: Response) => {
  res.send({ message: 'pong' })
})

// Rutas de autenticación
app.use('/auth', authRouter)

// Rutas de usuario
app.use('/user', userRoutes)

// Rutas de pacientes
app.use('/pacientes', pacienteRoutes)

// Rutas de citas
app.use('/citas', citaRoutes)

// Rutas de reportes DSS (Dashboard y análisis)
app.use('/dss', dssRoutes)

// Rutas de prueba
app.use('/test', testRoutes)

// Ruta para servir el HTML principal
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Middleware de manejo de errores (DEBE IR AL FINAL, después de todas las rutas)
app.use(errorHanddler)

export { app, port }