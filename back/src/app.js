import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import companyRoutes from './routes/company.routes.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import departmentRoutes from './routes/department.routes.js'
import areaRoutes from './routes/area.routes.js'
import { createRoles, createCompany, createArea, createDepartment, createUser } from './libs/initialSetup.js'

//Initial setup
const app = express()
createCompany()
createRoles()
createUser()
createDepartment()
createArea()

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

//Routes
app.use('/api/company', companyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/areas', areaRoutes)
app.use('/api/employees', employeeRoutes)


export default app;