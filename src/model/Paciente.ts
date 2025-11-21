import z from 'zod'

export const pacienteSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(2).max(100),
  cedula: z.string().min(5).max(20),
  telefono: z.string().min(7).max(20),
  email: z.string().email().optional(),
  fechaNacimiento: z.string().datetime(),
  direccion: z.string().optional(),
})

export const editPacienteSchema = pacienteSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para editar',
  })