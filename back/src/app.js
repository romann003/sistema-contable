import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import companyRoutes from './routes/company.routes.js'
import userRoutes from './routes/user.routes.js'
import departmentRoutes from './routes/department.routes.js'
import areaRoutes from './routes/area.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import rolRoutes from './routes/rol.routes.js'
import nominaRoutes from './routes/nomina.routes.js'
import dbRoutes from './routes/db.routes.js'
import nominaDatos from './routes/nominaDatos.routes.js'
import { createRoles, createCompany, createArea, createDepartment, createUser } from './libs/initialSetup.js'

//Initial setup
const app = express()
createCompany()
createRoles()
createUser()
createDepartment()
createArea()

//Middlewares
app.use(cors({
    // origin: 'http://25.58.152.111:5173',
    origin: 'http://localhost:5173',
    credentials: true
})); 
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/roles', rolRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/areas', areaRoutes)
app.use('/api/employees', employeeRoutes)
//Nominas
app.use('/api/nominas', nominaRoutes)
app.use('/api/nominaDatos', nominaDatos)
//DB
app.use('/api/db', dbRoutes)

//Error
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint no encontrado' })
})


export default app;