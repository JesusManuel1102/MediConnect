import { Router } from 'express'
import verifyToken from '../middleware/jwt/verifyToken'
import { verifySchema } from '../middleware/validateSchema'
import { citaSchema, editCitaSchema, estadoCitaSchema } from '../model/citaModel'
import {
  createCita,
  getAllCitas,
  getCitaById,
  getCitasByDate,
  getCitasByDoctor,
  getCitasPrioritarias,
  updateCita,
  updateEstadoCita,
  deleteCita,
} from '../controller/citaController'

const citaRoutes = Router()

// Todas las rutas requieren autenticación
citaRoutes.use(verifyToken)

citaRoutes
  // Crear nueva cita
  .post('/', verifySchema(citaSchema), createCita)
  
  // Obtener todas las citas
  .get('/', getAllCitas)
  
  // Obtener citas prioritarias (debe ir antes de /:id)
  .get('/prioritarias', getCitasPrioritarias)
  
  // Obtener citas por fecha (debe ir antes de /:id)
  .get('/fecha/:fecha', getCitasByDate)
  
  // Obtener citas por doctor (debe ir antes de /:id)
  .get('/doctor/:doctorId', getCitasByDoctor)
  
  // Obtener una cita por ID
  .get('/:id', getCitaById)
  
  // Actualizar cita completa
  .patch('/:id', verifySchema(editCitaSchema), updateCita)
  
  // Actualizar solo el estado de la cita
  .patch('/:id/estado', verifySchema(estadoCitaSchema), updateEstadoCita)
  
  // Eliminar cita
  .delete('/:id', deleteCita)

export default citaRoutes