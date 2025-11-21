export interface ICita {
  pacienteId: number
  doctorId: number
  fecha: Date
  hora: string
  especialidad: string
  tipoCita: 'prioritaria' | 'control' | 'consulta_externa' | 'primera_vez'
  estado?: 'programada' | 'completada' | 'cancelada' | 'no_asistio'
  motivo?: string
  observaciones?: string
  consultorio?: string
}

export interface IEditCita extends Partial<ICita> {}