import { RequestHandler } from 'express'
import dssService from '../service/dssService'

export const getDashboardEjecutivo: RequestHandler = async (req, res) => {
  const fechaInicioParam = req.query.fechaInicio
  const fechaFinParam = req.query.fechaFin
  
  if (!fechaInicioParam || typeof fechaInicioParam !== 'string') {
    return res.status(400).json({ message: 'fechaInicio es requerida' })
  }
  
  if (!fechaFinParam || typeof fechaFinParam !== 'string') {
    return res.status(400).json({ message: 'fechaFin es requerida' })
  }
  
  const fechaInicio = new Date(fechaInicioParam)
  const fechaFin = new Date(fechaFinParam)
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return res.status(400).json({ message: 'Fechas inválidas' })
  }
  
  const reporte = await dssService.getDashboardEjecutivo(fechaInicio, fechaFin)
  res.json(reporte)
}

export const getTendenciasDemanda: RequestHandler = async (_req, res) => {
  const reporte = await dssService.getTendenciasDemanda()
  res.json(reporte)
}

export const getDesempenoPorDoctor: RequestHandler = async (req, res) => {
  const fechaInicioParam = req.query.fechaInicio
  const fechaFinParam = req.query.fechaFin
  
  if (!fechaInicioParam || typeof fechaInicioParam !== 'string') {
    return res.status(400).json({ message: 'fechaInicio es requerida' })
  }
  
  if (!fechaFinParam || typeof fechaFinParam !== 'string') {
    return res.status(400).json({ message: 'fechaFin es requerida' })
  }
  
  const fechaInicio = new Date(fechaInicioParam)
  const fechaFin = new Date(fechaFinParam)
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return res.status(400).json({ message: 'Fechas inválidas' })
  }
  
  const reporte = await dssService.getDesempenoPorDoctor(fechaInicio, fechaFin)
  res.json(reporte)
}

export const getCasosPrioritarios: RequestHandler = async (_req, res) => {
  const reporte = await dssService.getCasosPrioritarios()
  res.json(reporte)
}

export const getOptimizacionAgendas: RequestHandler = async (req, res) => {
  const fechaParam = req.query.fecha
  
  if (!fechaParam || typeof fechaParam !== 'string') {
    return res.status(400).json({ message: 'fecha es requerida' })
  }
  
  const fecha = new Date(fechaParam)
  
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ message: 'Fecha inválida' })
  }
  
  const reporte = await dssService.getOptimizacionAgendas(fecha)
  res.json(reporte)
}

export const getAnalisisAusentismo: RequestHandler = async (req, res) => {
  const fechaInicioParam = req.query.fechaInicio
  const fechaFinParam = req.query.fechaFin
  
  if (!fechaInicioParam || typeof fechaInicioParam !== 'string') {
    return res.status(400).json({ message: 'fechaInicio es requerida' })
  }
  
  if (!fechaFinParam || typeof fechaFinParam !== 'string') {
    return res.status(400).json({ message: 'fechaFin es requerida' })
  }
  
  const fechaInicio = new Date(fechaInicioParam)
  const fechaFin = new Date(fechaFinParam)
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return res.status(400).json({ message: 'Fechas inválidas' })
  }
  
  const reporte = await dssService.getAnalisisAusentismo(fechaInicio, fechaFin)
  res.json(reporte)
}

export const getAnalisisFinanciero: RequestHandler = async (req, res) => {
  const fechaInicioParam = req.query.fechaInicio
  const fechaFinParam = req.query.fechaFin
  
  if (!fechaInicioParam || typeof fechaInicioParam !== 'string') {
    return res.status(400).json({ message: 'fechaInicio es requerida' })
  }
  
  if (!fechaFinParam || typeof fechaFinParam !== 'string') {
    return res.status(400).json({ message: 'fechaFin es requerida' })
  }
  
  const fechaInicio = new Date(fechaInicioParam)
  const fechaFin = new Date(fechaFinParam)
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return res.status(400).json({ message: 'Fechas inválidas' })
  }
  
  const reporte = await dssService.getAnalisisFinanciero(fechaInicio, fechaFin)
  res.json(reporte)
}

export const getProductividadPersonal: RequestHandler = async (req, res) => {
  const fechaInicioParam = req.query.fechaInicio
  const fechaFinParam = req.query.fechaFin
  
  if (!fechaInicioParam || typeof fechaInicioParam !== 'string') {
    return res.status(400).json({ message: 'fechaInicio es requerida' })
  }
  
  if (!fechaFinParam || typeof fechaFinParam !== 'string') {
    return res.status(400).json({ message: 'fechaFin es requerida' })
  }
  
  const fechaInicio = new Date(fechaInicioParam)
  const fechaFin = new Date(fechaFinParam)
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return res.status(400).json({ message: 'Fechas inválidas' })
  }
  
  const reporte = await dssService.getProductividadPersonal(fechaInicio, fechaFin)
  res.json(reporte)
}