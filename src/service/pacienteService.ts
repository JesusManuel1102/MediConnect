import prisma from '../config/database'
import { IPaciente, IEditPaciente } from '../model/IPaciente'

const pacienteService = {
  create: async (data: IPaciente) => 
    await prisma.paciente.create({ data }),

  getAll: async () => 
    await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    }),

  getById: async (id: number) => 
    await prisma.paciente.findUnique({ 
      where: { id },
      include: { citas: true },
    }),

  getByCedula: async (cedula: string) =>
    await prisma.paciente.findUnique({ where: { cedula } }),

  update: async (id: number, data: IEditPaciente) =>
    await prisma.paciente.update({
      where: { id },
      data,
    }),

  delete: async (id: number) => 
    await prisma.paciente.delete({ where: { id } }),

  // Buscar pacientes con filtros
  search: async (query: string) =>
    await prisma.paciente.findMany({
      where: {
        OR: [
          { nombre: { contains: query } },
          { apellido: { contains: query } },
          { cedula: { contains: query } },
        ],
      },
    }),
}

export default pacienteService