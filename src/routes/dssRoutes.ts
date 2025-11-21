import { Router } from 'express'
import verifyToken from '../middleware/jwt/verifyToken'
import {
  getDashboardEjecutivo,
  getTendenciasDemanda,
  getDesempenoPorDoctor,
  getCasosPrioritarios,
  getOptimizacionAgendas,
  getAnalisisAusentismo,
  getAnalisisFinanciero,
  getProductividadPersonal,
} from '../controller/dssController'

const dssRoutes = Router()

// Todas las rutas DSS requieren autenticación
dssRoutes.use(verifyToken)

// REPORTE 1: Dashboard Ejecutivo General
dssRoutes.get('/dashboard-ejecutivo', getDashboardEjecutivo)

// REPORTE 2: Análisis de Tendencias de Demanda
dssRoutes.get('/tendencias-demanda', getTendenciasDemanda)

// REPORTE 3: Desempeño por Doctor y Especialidad
dssRoutes.get('/desempeno-doctores', getDesempenoPorDoctor)

// REPORTE 4: Gestión de Casos Prioritarios (ALERTAS)
dssRoutes.get('/casos-prioritarios', getCasosPrioritarios)

// REPORTE 5: Optimización de Agendas y Consultorios
dssRoutes.get('/optimizacion-agendas', getOptimizacionAgendas)

// REPORTE 6: Análisis de Ausentismo de Pacientes
dssRoutes.get('/analisis-ausentismo', getAnalisisAusentismo)

// REPORTE 7: Análisis Financiero (Ingresos estimados)
dssRoutes.get('/analisis-financiero', getAnalisisFinanciero)

// REPORTE 8: Productividad del Personal Médico
dssRoutes.get('/productividad-personal', getProductividadPersonal)

export default dssRoutes