import prisma from '../config/database'

const dssService = {
  // REPORTE 1: Dashboard Ejecutivo
  getDashboardEjecutivo: async (fechaInicio: Date, fechaFin: Date) => {
    const totalCitas = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
      },
    })

    const citasCompletadas = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'completada',
      },
    })

    const citasCanceladas = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'cancelada',
      },
    })

    const noAsistencias = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'no_asistio',
      },
    })

    const tasaOcupacion = totalCitas > 0 
      ? ((citasCompletadas / totalCitas) * 100).toFixed(2) 
      : 0

    const tasaCancelacion = totalCitas > 0
      ? ((citasCanceladas / totalCitas) * 100).toFixed(2)
      : 0

    return {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      totalCitas,
      citasCompletadas,
      citasCanceladas,
      noAsistencias,
      tasaOcupacion: `${tasaOcupacion}%`,
      tasaCancelacion: `${tasaCancelacion}%`,
    }
  },

  // REPORTE 2: Análisis de Tendencias de Demanda
  getTendenciasDemanda: async () => {
    const citasPorEspecialidad = await prisma.cita.groupBy({
      by: ['especialidad'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    const citasPorTipo = await prisma.cita.groupBy({
      by: ['tipoCita'],
      _count: { id: true },
    })

    const citasPorMes = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', fecha) as mes,
        COUNT(*) as total
      FROM Cita
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `

    return {
      especialidadesMasSolicitadas: citasPorEspecialidad.map((e) => ({
        especialidad: e.especialidad,
        total: e._count.id,
      })),
      distribucionPorTipo: citasPorTipo.map((t) => ({
        tipo: t.tipoCita,
        total: t._count.id,
      })),
      evolucionMensual: citasPorMes,
    }
  },

  // REPORTE 3: Desempeño por Especialidad y Doctor
  getDesempenoPorDoctor: async (fechaInicio: Date, fechaFin: Date) => {
    const doctores = await prisma.user.findMany({
      where: { role: 'doctor' },
      include: {
        citas: {
          where: {
            fecha: { gte: fechaInicio, lte: fechaFin },
          },
        },
      },
    })

    return doctores.map((doctor) => {
      const totalCitas = doctor.citas.length
      const completadas = doctor.citas.filter((c) => c.estado === 'completada').length
      const tasaEfectividad = totalCitas > 0 
        ? ((completadas / totalCitas) * 100).toFixed(2) 
        : 0

      return {
        doctorId: doctor.id,
        nombreDoctor: doctor.username,
        especialidad: doctor.especialidad,
        totalCitas,
        citasCompletadas: completadas,
        tasaEfectividad: `${tasaEfectividad}%`,
      }
    })
  },

  // REPORTE 4: Gestión de Casos Prioritarios
  getCasosPrioritarios: async () => {
    const citasPrioritarias = await prisma.cita.findMany({
      where: {
        tipoCita: 'prioritaria',
        estado: 'programada',
      },
      include: {
        paciente: true,
        doctor: true,
      },
      orderBy: { fecha: 'asc' },
    })

    const alertas = citasPrioritarias.map((cita) => {
      const diasEspera = Math.ceil(
        (new Date(cita.fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        citaId: cita.id,
        paciente: `${cita.paciente.nombre} ${cita.paciente.apellido}`,
        doctor: cita.doctor.username,
        especialidad: cita.especialidad,
        fechaProgramada: cita.fecha,
        diasParaCita: diasEspera,
        alerta: diasEspera > 2 ? 'URGENTE' : 'Normal',
      }
    })

    return {
      totalPrioritarias: citasPrioritarias.length,
      alertasUrgentes: alertas.filter((a) => a.alerta === 'URGENTE').length,
      listaCasos: alertas,
    }
  },

  // REPORTE 5: Optimización de Agendas
  getOptimizacionAgendas: async (fecha: Date) => {
    const citasDelDia = await prisma.cita.findMany({
      where: {
        fecha: {
          gte: new Date(fecha.setHours(0, 0, 0, 0)),
          lt: new Date(fecha.setHours(23, 59, 59, 999)),
        },
      },
      include: { doctor: true },
    })

    const consultoriosUsados = new Set(citasDelDia.map((c) => c.consultorio)).size
    const horariosOcupados = citasDelDia.length

    return {
      fecha,
      totalCitas: citasDelDia.length,
      consultoriosEnUso: consultoriosUsados,
      horasOcupadas: horariosOcupados,
      espaciosDisponibles: 40 - horariosOcupados, // Asumiendo 40 espacios por día
      tasaOcupacion: `${((horariosOcupados / 40) * 100).toFixed(2)}%`,
    }
  },

  // REPORTE 6: Análisis de Ausentismo
  getAnalisisAusentismo: async (fechaInicio: Date, fechaFin: Date) => {
    const totalCitas = await prisma.cita.count({
      where: { fecha: { gte: fechaInicio, lte: fechaFin } },
    })

    const noAsistencias = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'no_asistio',
      },
    })

    const porcentajeAusentismo = totalCitas > 0
      ? ((noAsistencias / totalCitas) * 100).toFixed(2)
      : 0

    const pacientesConMasAusencias = await prisma.$queryRaw`
      SELECT 
        p.nombre || ' ' || p.apellido as paciente,
        COUNT(*) as ausencias
      FROM Cita c
      JOIN Paciente p ON c.pacienteId = p.id
      WHERE c.estado = 'no_asistio'
        AND c.fecha >= ${fechaInicio}
        AND c.fecha <= ${fechaFin}
      GROUP BY c.pacienteId
      ORDER BY ausencias DESC
      LIMIT 10
    `

    return {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      totalCitas,
      noAsistencias,
      porcentajeAusentismo: `${porcentajeAusentismo}%`,
      pacientesConMasAusencias,
    }
  },

  // REPORTE 7: Análisis Financiero (simulado - en producción conectarías con módulo de pagos)
  getAnalisisFinanciero: async (fechaInicio: Date, fechaFin: Date) => {
    const costoPromedioPorConsulta = 50 // USD - esto vendría de configuración

    const citasCompletadas = await prisma.cita.count({
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'completada',
      },
    })

    const ingresosPorEspecialidad = await prisma.cita.groupBy({
      by: ['especialidad'],
      where: {
        fecha: { gte: fechaInicio, lte: fechaFin },
        estado: 'completada',
      },
      _count: { id: true },
    })

    const ingresosEstimados = citasCompletadas * costoPromedioPorConsulta

    return {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      citasCompletadas,
      ingresosEstimados: `$${ingresosEstimados.toFixed(2)}`,
      costoPromedioPorConsulta: `$${costoPromedioPorConsulta}`,
      ingresosPorEspecialidad: ingresosPorEspecialidad.map((e) => ({
        especialidad: e.especialidad,
        citasCompletadas: e._count.id,
        ingresos: `$${(e._count.id * costoPromedioPorConsulta).toFixed(2)}`,
      })),
    }
  },

  // REPORTE 8: Productividad del Personal
  getProductividadPersonal: async (fechaInicio: Date, fechaFin: Date) => {
    const doctores = await prisma.user.findMany({
      where: { role: 'doctor' },
      include: {
        citas: {
          where: {
            fecha: { gte: fechaInicio, lte: fechaFin },
            estado: 'completada',
          },
        },
      },
    })

    const diasLaborables = Math.ceil(
      (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
    )

    return doctores.map((doctor) => {
      const citasCompletadas = doctor.citas.length
      const promedioDiario = diasLaborables > 0 
        ? (citasCompletadas / diasLaborables).toFixed(2) 
        : 0

      return {
        doctorId: doctor.id,
        nombreDoctor: doctor.username,
        especialidad: doctor.especialidad,
        citasCompletadas,
        promedioCitasPorDia: promedioDiario,
        eficiencia: citasCompletadas >= 20 ? 'Alta' : citasCompletadas >= 10 ? 'Media' : 'Baja',
      }
    })
  },
}

export default dssService