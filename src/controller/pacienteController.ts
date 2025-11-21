import { RequestHandler } from 'express'
import pacienteService from '../service/PacienteService'
import { IPaciente } from '../model/IPaciente'

export const createPaciente: RequestHandler = async (req, res) => {
  const data: IPaciente = req.body
  const paciente = await pacienteService.create(data)
  res.status(201).json(paciente)
}

export const getAllPacientes: RequestHandler = async (_req, res) => {
  const pacientes = await pacienteService.getAll()
  res.json(pacientes)
}

export const getPacienteById: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de paciente requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de paciente inválido' })
  }
  
  const paciente = await pacienteService.getById(id)
  
  if (!paciente) {
    return res.status(404).json({ message: 'Paciente no encontrado' })
  }
  
  res.json(paciente)
}

export const updatePaciente: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de paciente requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de paciente inválido' })
  }
  
  const data = req.body
  const paciente = await pacienteService.update(id, data)
  res.json(paciente)
}

export const deletePaciente: RequestHandler = async (req, res) => {
  const idParam = req.params.id
  
  if (!idParam) {
    return res.status(400).json({ message: 'ID de paciente requerido' })
  }
  
  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de paciente inválido' })
  }
  
  await pacienteService.delete(id)
  res.status(204).send()
}

export const searchPacientes: RequestHandler = async (req, res) => {
  const query = req.query.q
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'El parámetro de búsqueda "q" es requerido' })
  }
  
  const pacientes = await pacienteService.search(query)
  res.json(pacientes)
}