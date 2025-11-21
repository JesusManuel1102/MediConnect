import { RequestHandler } from 'express'
import citaService from '../service/citaService'
import { ICita } from '../model/ICita'

export const createCita: RequestHandler = async (req, res) => {
  const data: ICita = req.body
  const cita = await citaService.create(data)
  res.status(201).json(cita)
}

export const getAllCitas: RequestHandler = async (_req, res) => {
  const citas = await citaService.getAll()
  res.json(citas)
}

export const getCitaById: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de cita requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de cita inválido' })
  }
  
  const cita = await citaService.getById(id)
  
  if (!cita) {
    return res.status(404).json({ message: 'Cita no encontrada' })
  }
  
  res.json(cita)
}

export const getCitasByDate: RequestHandler = async (req, res) => {
  const fechaParam = req.params.fecha
  
  if (!fechaParam) {
    return res.status(400).json({ message: 'Fecha requerida' })
  }
  
  const fecha = new Date(fechaParam)
  
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ message: 'Fecha inválida' })
  }
  
  const citas = await citaService.getByDate(fecha)
  res.json(citas)
}

export const getCitasByDoctor: RequestHandler = async (req, res) => {
  const doctorIdParam = req.params.doctorId
  
  if (!doctorIdParam) {
    return res.status(400).json({ message: 'ID de doctor requerido' })
  }
  
  const doctorId = parseInt(doctorIdParam)
  
  if (isNaN(doctorId)) {
    return res.status(400).json({ message: 'ID de doctor inválido' })
  }
  
  const citas = await citaService.getByDoctor(doctorId)
  res.json(citas)
}

export const getCitasPrioritarias: RequestHandler = async (_req, res) => {
  const citas = await citaService.getPrioritarias()
  res.json(citas)
}

export const updateCita: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de cita requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de cita inválido' })
  }
  
  const data = req.body
  const cita = await citaService.update(id, data)
  res.json(cita)
}

export const updateEstadoCita: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de cita requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de cita inválido' })
  }
  
  const { estado } = req.body
  const cita = await citaService.updateEstado(id, estado)
  res.json(cita)
}

export const deleteCita: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de cita requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de cita inválido' })
  }
  
  await citaService.delete(id)
  res.status(204).send()
}