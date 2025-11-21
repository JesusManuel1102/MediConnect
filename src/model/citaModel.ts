import z from 'zod'

export const citaSchema = z.object({
  pacienteId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  fecha: z.string().datetime(),
  hora: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  especialidad: z.string().min(2),
  tipoCita: z.enum(['prioritaria', 'control', 'consulta_externa', 'primera_vez']),
  motivo: z.string().optional(),
  observaciones: z.string().optional(),
  consultorio: z.string().optional(),
})

export const editCitaSchema = citaSchema.partial()

export const estadoCitaSchema = z.object({
  estado: z.enum(['programada', 'completada', 'cancelada', 'no_asistio']),
})