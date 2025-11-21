// Configuración de la API
const API_URL = 'http://localhost:8000'
let authToken = localStorage.getItem('token')
let currentUser = JSON.parse(localStorage.getItem('user') || '{}')

// Utilidades
const api = {
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        }
        
        if (authToken) {
            headers['token'] = authToken
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        })

        if (response.status === 401) {
            logout()
            return
        }

        const newToken = response.headers.get('token')
        if (newToken) {
            authToken = newToken
            localStorage.setItem('token', newToken)
        }

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Error en la petición')
        }

        return response.json()
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' })
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' })
    }
}

// Navegación
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
    document.getElementById(screenId).classList.add('active')
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'))
    document.getElementById(sectionId).classList.add('active')
    
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'))
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active')
}

// Autenticación
async function login(e) {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const errorDiv = document.getElementById('loginError')

    try {
        const data = await api.post('/auth/login', { username, password, role: 'admin' })
        currentUser = data.user
        localStorage.setItem('user', JSON.stringify(currentUser))
        document.getElementById('userDisplay').textContent = currentUser.username
        showScreen('dashboardScreen')
        loadDashboard()
    } catch (error) {
        errorDiv.textContent = error.message
        errorDiv.classList.remove('hidden')
    }
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    authToken = null
    currentUser = {}
    showScreen('loginScreen')
}

// Dashboard
async function loadDashboard() {
    const fechaFin = new Date()
    const fechaInicio = new Date()
    fechaInicio.setDate(fechaInicio.getDate() - 30)

    try {
        const data = await api.get(`/dss/dashboard-ejecutivo?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`)
        
        const statsHTML = `
            <div class="stat-card">
                <h3>Total Citas</h3>
                <div class="value">${data.totalCitas}</div>
            </div>
            <div class="stat-card">
                <h3>Completadas</h3>
                <div class="value">${data.citasCompletadas}</div>
            </div>
            <div class="stat-card">
                <h3>Tasa Ocupación</h3>
                <div class="value">${data.tasaOcupacion}</div>
            </div>
            <div class="stat-card">
                <h3>Canceladas</h3>
                <div class="value">${data.citasCanceladas}</div>
            </div>
        `
        
        document.getElementById('dashboardStats').innerHTML = statsHTML
    } catch (error) {
        console.error('Error cargando dashboard:', error)
    }
}

// Pacientes
async function loadPacientes() {
    try {
        const pacientes = await api.get('/pacientes')
        const listHTML = pacientes.map(p => `
            <div class="list-item">
                <div>
                    <strong>${p.nombre} ${p.apellido}</strong><br>
                    <small>Cédula: ${p.cedula} | Tel: ${p.telefono}</small>
                </div>
                <button onclick="editPaciente(${p.id})">Editar</button>
            </div>
        `).join('')
        
        document.getElementById('pacientesList').innerHTML = listHTML
    } catch (error) {
        console.error('Error cargando pacientes:', error)
    }
}

async function createPaciente(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    data.fechaNacimiento = new Date(data.fechaNacimiento).toISOString()

    try {
        await api.post('/pacientes', data)
        closeModal('modalPaciente')
        loadPacientes()
        e.target.reset()
    } catch (error) {
        alert('Error: ' + error.message)
    }
}

// Citas
async function loadCitas() {
    try {
        const citas = await api.get('/citas')
        const listHTML = citas.map(c => `
            <div class="list-item">
                <div>
                    <strong>${c.paciente.nombre} ${c.paciente.apellido}</strong><br>
                    <small>Doctor: ${c.doctor.username} | ${new Date(c.fecha).toLocaleDateString()} ${c.hora}</small><br>
                    <small>Tipo: ${c.tipoCita} | Estado: ${c.estado}</small>
                </div>
                <button onclick="editCita(${c.id})">Ver</button>
            </div>
        `).join('')
        
        document.getElementById('citasList').innerHTML = listHTML
    } catch (error) {
        console.error('Error cargando citas:', error)
    }
}

async function createCita(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    data.pacienteId = parseInt(data.pacienteId)
    data.doctorId = parseInt(data.doctorId)
    data.fecha = new Date(data.fecha).toISOString()

    try {
        await api.post('/citas', data)
        closeModal('modalCita')
        loadCitas()
        e.target.reset()
    } catch (error) {
        alert('Error: ' + error.message)
    }
}

// Modals
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active')
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active')
}

// Reportes
async function loadReport(reportType) {
    const fechaFin = new Date()
    const fechaInicio = new Date()
    fechaInicio.setDate(fechaInicio.getDate() - 30)

    const endpoints = {
        tendencias: '/dss/tendencias-demanda',
        desempeno: `/dss/desempeno-doctores?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`,
        prioritarios: '/dss/casos-prioritarios',
        ausentismo: `/dss/analisis-ausentismo?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`
    }

    try {
        const data = await api.get(endpoints[reportType])
        document.getElementById('reporteOutput').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`
    } catch (error) {
        console.error('Error cargando reporte:', error)
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login
    document.getElementById('loginForm').addEventListener('submit', login)
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout)
    
    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.target.dataset.section
            showSection(section)
            if (section === 'pacientes') loadPacientes()
            if (section === 'citas') loadCitas()
            if (section === 'dashboard') loadDashboard()
        })
    })
    
    // Modals
    document.getElementById('btnNuevoPaciente')?.addEventListener('click', () => openModal('modalPaciente'))
    document.getElementById('btnNuevaCita')?.addEventListener('click', () => openModal('modalCita'))
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal')
            modal.classList.remove('active')
        })
    })
    
    // Forms
    document.getElementById('formPaciente')?.addEventListener('submit', createPaciente)
    document.getElementById('formCita')?.addEventListener('submit', createCita)
    
    // Reports
    document.querySelectorAll('.report-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const report = e.target.dataset.report
            loadReport(report)
        })
    })
    
    // Check if already logged in
    if (authToken && currentUser.username) {
        document.getElementById('userDisplay').textContent = currentUser.username
        showScreen('dashboardScreen')
        loadDashboard()
    } else {
        showScreen('loginScreen')
    }
})
