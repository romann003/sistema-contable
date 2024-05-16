import { RolSchema } from "../models/Rol.js"
import { CompanySchema } from "../models/Company.js";
import { AreaSchema } from "../models/Area.js";
import { DepartmentSchema } from "../models/Department.js";
import { UserSchema, encryptPassword } from "../models/User.js";

export const createRoles = async () => {

    try {
        const count = await RolSchema.count()

        if (count > 0) return;

        const values = await Promise.all([
            RolSchema.create({ name: 'root' }),
            RolSchema.create({ name: 'administrador' }),
            RolSchema.create({ name: 'moderador' })
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }
}

export const createCompany = async () => {
    try {
        const count = await CompanySchema.count()

        if (count > 0) return;

        const values = await Promise.all([
            CompanySchema.create({
                business_name: 'Sistema Contable UMG',
                nit: '123456789-1',
                phone: 55663322,
                address: 'Calle 123'
            })
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }
}

export const createUser = async () => {
    try {
        const count = await UserSchema.count()

        if (count > 0) return;

        const values = await Promise.all([
            UserSchema.create({
                name: 'SUPER',
                last_name: 'ADMIN',
                username: 'super admin',
                email: 'sadmin@sadmin.com',
                password: await encryptPassword('sadmin123'),
                status: true,
                rolId: 1,
                companyId: 1
            })
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }
}

export const createDepartment = async () => {
    try {
        const count = await DepartmentSchema.count()

        if (count > 0) return;

        const values = await Promise.all([
            DepartmentSchema.create({
                name: 'Marketing',
                description: 'Marketing de la empresa',
                companyId: 1
            })
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }
}

export const createArea = async () => {
    try {
        const count = await AreaSchema.count()

        if (count > 0) return;

        const values = await Promise.all([
            AreaSchema.create({
                name: 'Jefe de Marketing',
                description: 'Jefe de marketing de la empresa',
                salary: 10000,
                departmentId: 1
            }),
            AreaSchema.create({
                name: 'Investigacion de Mercados',
                description: 'Investigador de mercados de la empresa',
                salary: 8000,
                departmentId: 1
            })
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }
}