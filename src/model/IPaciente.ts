export interface IPaciente {
  nombre: string
  apellido: string
  cedula: string
  telefono: string
  email?: string
  fechaNacimiento: Date
  direccion?: string
}

export interface IEditPaciente extends Partial<IPaciente> {}