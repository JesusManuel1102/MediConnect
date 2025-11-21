
import { Router } from 'express'
import verifyToken from '../middleware/jwt/verifyToken'
import { verifySchema } from '../middleware/validateSchema'
import { pacienteSchema, editPacienteSchema } from '../model/Paciente'
import {
  createPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
  searchPacientes,
} from '../controller/pacienteController'

const pacienteRoutes = Router()

// Todas las rutas requieren autenticación
pacienteRoutes.use(verifyToken)

pacienteRoutes
  .post('/', verifySchema(pacienteSchema), createPaciente)
  .get('/', getAllPacientes)
  .get('/search', searchPacientes) // Debe ir antes de /:id
  .get('/:id', getPacienteById)
  .patch('/:id', verifySchema(editPacienteSchema), updatePaciente)
  .delete('/:id', deletePaciente)

export default pacienteRoutes