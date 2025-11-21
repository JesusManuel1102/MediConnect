import prisma from '../config/database'
import { ICita, IEditCita } from '../model/ICita'

const citaService = {
  create: async (data: ICita) =>
    await prisma.cita.create({
      data,
      include: {
        paciente: true,
        doctor: true,
      },
    }),

  getAll: async () =>
    await prisma.cita.findMany({
      include: {
        paciente: true,
        doctor: true,
      },
      orderBy: { fecha: 'desc' },
    }),

  getById: async (id: number) =>
    await prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: true,
        doctor: true,
      },
    }),

  // Obtener citas por fecha
  getByDate: async (fecha: Date) =>
    await prisma.cita.findMany({
      where: {
        fecha: {
          gte: new Date(fecha.setHours(0, 0, 0, 0)),
          lt: new Date(fecha.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        paciente: true,
        doctor: true,
      },
      orderBy: { hora: 'asc' },
    }),

  // Obtener citas por doctor
  getByDoctor: async (doctorId: number) =>
    await prisma.cita.findMany({
      where: { doctorId },
      include: { paciente: true },
      orderBy: { fecha: 'desc' },
    }),

  // Obtener citas por paciente
  getByPaciente: async (pacienteId: number) =>
    await prisma.cita.findMany({
      where: { pacienteId },
      include: { doctor: true },
      orderBy: { fecha: 'desc' },
    }),

  // Obtener citas prioritarias
  getPrioritarias: async () =>
    await prisma.cita.findMany({
      where: {
        tipoCita: 'prioritaria',
        estado: 'programada',
      },
      include: {
        paciente: true,
        doctor: true,
      },
      orderBy: { fecha: 'asc' },
    }),

  update: async (id: number, data: IEditCita) =>
    await prisma.cita.update({
      where: { id },
      data,
      include: {
        paciente: true,
        doctor: true,
      },
    }),

  updateEstado: async (id: number, estado: string) =>
    await prisma.cita.update({
      where: { id },
      data: { estado },
    }),

  delete: async (id: number) => 
    await prisma.cita.delete({ where: { id } }),
}

export default citaService