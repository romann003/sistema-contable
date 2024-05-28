import { RolSchema } from "../models/Rol.js"
import { CompanySchema } from "../models/Company.js";
import { AreaSchema } from "../models/Area.js";
import { DepartmentSchema } from "../models/Department.js";
import { UserSchema, encryptPassword } from "../models/User.js";
import { EmployeeSchema } from "../models/Employee.js";

export const createRoles = async () => {
    try {
        const count = await RolSchema.count()
        if (count > 0) return;

        const values = await Promise.all([
            RolSchema.create({ name: 'root' }),
            RolSchema.create({ name: 'administrador' }),
            RolSchema.create({ name: 'moderador' })
        ])
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
                business_name: 'Pago de Nominas UMG',
                nit: '29938475-4',
                phone: 12345678,
                address: 'Avenida Reforma 8-45, Zona 10, Ciudad de Guatemala, Guatemala'
            })
        ])
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
                name: 'BRYAN',
                last_name: 'ROMAN',
                username: 'bromang',
                email: 'bromang@gmail.com',
                password: await encryptPassword('bromang123'),
                status: true,
                rolId: 1,
                companyId: 1
            }),
            UserSchema.create({
                name: 'WALTER',
                last_name: 'GARCIA',
                username: 'wgarcia',
                email: 'wgarcia@gmail.com',
                password: await encryptPassword('wgarcia123'),
                status: true,
                rolId: 1,
                companyId: 1
            }),
            UserSchema.create({
                name: 'ANDRES',
                last_name: 'BARRERA',
                username: 'abarrera',
                email: 'abarrera@gmail.com',
                password: await encryptPassword('abarrera123'),
                status: true,
                rolId: 2,
                companyId: 1
            }),
            UserSchema.create({
                name: 'NESTOR',
                last_name: 'PEREZ',
                username: 'nperez',
                email: 'nperez@gmail.com',
                password: await encryptPassword('nperez123'),
                status: true,
                rolId: 2,
                companyId: 1
            }),
            UserSchema.create({
                name: 'HENRY',
                last_name: 'ESCORCIA',
                username: 'hescorcia',
                email: 'hescorcia@gmail.com',
                password: await encryptPassword('hescorcia123'),
                status: true,
                rolId: 3,
                companyId: 1
            }),
            UserSchema.create({
                name: 'SCARLETH',
                last_name: 'MARROQUIN',
                username: 'smarroquin',
                email: 'smarroquin@gmail.com',
                password: await encryptPassword('smarroquin123'),
                status: true,
                rolId: 3,
                companyId: 1
            })
        ])
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
                name: 'Desarrollo de Software',
                description: 'Responsable del diseño, desarrollo y mantenimiento de los productos de software de la empresa.',
                companyId: 1
            }),
            DepartmentSchema.create({
                name: 'Infraestructura y Redes',
                description: 'Mantiene y mejora la infraestructura tecnológica de la empresa, incluyendo servidores, redes y seguridad.',
                companyId: 1
            }),
            DepartmentSchema.create({
                name: 'Recursos Humanos',
                description: 'Maneja la contratación, formación, desarrollo y bienestar de los empleados de la empresa.',
                companyId: 1
            }),
            DepartmentSchema.create({
                name: 'Marketing y Ventas',
                description: 'Desarrolla e implementa estrategias para promocionar los productos y servicios de la empresa y gestiona las relaciones con los clientes.',
                companyId: 1
            }),
        ])
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
                name: 'Lider de Equipo de Desarrollo',
                description: 'Coordina y supervisa al equipo de desarrolladores para garantizar el cumplimiento de los plazos y la calidad del software.',
                salary: 20000,
                departmentId: 1
            }),
            AreaSchema.create({
                name: 'Desarrollador Full Stack',
                description: 'Diseña y desarrolla aplicaciones tanto del lado del cliente como del servidor.',
                salary: 15000,
                departmentId: 1
            }),
            AreaSchema.create({
                name: 'Ingeniero de Calidad (QA)',
                description: 'Se asegura de que los productos de software cumplan con los estándares de calidad mediante pruebas y revisiones.',
                salary: 12000,
                departmentId: 1
            }),
            AreaSchema.create({
                name: 'Especialista en Seguridad Informática',
                description: 'Protege la infraestructura tecnológica de la empresa de amenazas y ataques cibernéticos.',
                salary: 18000,
                departmentId: 2
            }),
            AreaSchema.create({
                name: 'Ingeniero de Redes',
                description: 'Diseña, implementa y mantiene la infraestructura de red de la empresa.',
                salary: 15000,
                departmentId: 2
            }),
            AreaSchema.create({
                name: 'Administrador de Sistemas',
                description: 'Gestiona y mantiene los servidores y sistemas de la empresa.',
                salary: 14000,
                departmentId: 2
            }),
            AreaSchema.create({
                name: 'Gerente de Recursos Humanos',
                description: 'Dirige el departamento y establece políticas de gestión del personal.',
                salary: 20000,
                departmentId: 3
            }),
            AreaSchema.create({
                name: 'Especialista en Reclutamiento',
                description: 'Se encarga de atraer, seleccionar y contratar nuevos talentos.',
                salary: 10000,
                departmentId: 3
            }),
            AreaSchema.create({
                name: 'Especialista en Formación y Desarrollo',
                description: 'Diseña e imparte programas de formación y desarrollo para los empleados.',
                salary: 12000,
                departmentId: 3
            }),
            AreaSchema.create({
                name: 'Gerente de Marketing',
                description: 'Dirige el departamento y establece estrategias de marketing.',
                salary: 20000,
                departmentId: 4
            }),
            AreaSchema.create({
                name: 'Especialista en Marketing Digital',
                description: 'Desarrolla e implementa estrategias de marketing en línea.',
                salary: 13000,
                departmentId: 4
            }),
            AreaSchema.create({
                name: 'Especialista en Ventas',
                description: 'Gestiona las relaciones con los clientes y cierra acuerdos de venta.',
                salary: 12000,
                departmentId: 4
            }),
        ])
    } catch (error) {
        console.log(error)
    }
}

export const createEmployee = async () => {
    try {
        const count = await EmployeeSchema.count()
        if (count > 0) return;

        const values = await Promise.all([
            EmployeeSchema.create({
                name: "Juan",
                last_name: "Pérez",
                phone: 12345678,
                country: "Guatemala",
                identification_type: "DPI",
                identification: "1234567890101",
                nit: "1234567-8",
                igss: 78901234,
                gender: "Masculino",
                birthdate: "1990-05-15",
                address: "Avenida Las Americas 1234, Ciudad de Guatemala",
                hire_date: "2019-08-01",
                contract_type: "Indefinido",
                work_day: "Ordinaria",
                status: true,
                departmentId: 1,
                areaId: 1
            }),
            EmployeeSchema.create({
                name: "Ana",
                last_name: "García",
                phone: 87654321,
                country: "Guatemala",
                identification_type: "DPI",
                identification: "2345678901023",
                nit: "2345678-9",
                igss: 89012345,
                gender: "Femenino",
                birthdate: "1988-07-10",
                address: "12 Calle 10-11 Zona 1, Ciudad de Guatemala",
                hire_date: "2020-05-20",
                contract_type: "Contrato",
                work_day: "Medio Tiempo",
                status: true,
                departmentId: 1,
                areaId: 2
            }),
            EmployeeSchema.create({
                name: "María",
                last_name: "López",
                phone: 87654321,
                country: "Guatemala",
                identification_type: "DPI",
                identification: "1234567890102",
                nit: "1234567-9",
                igss: 78901235,
                gender: "Femenino",
                birthdate: "1990-03-22",
                address: "6a Avenida 12-34 Zona 10, Ciudad de Guatemala",
                hire_date: "2020-01-10",
                contract_type: "Tiempo Completo",
                work_day: "Mixta",
                status: true,
                departmentId: 2,
                areaId: 2
            }),
            EmployeeSchema.create({
                name: "Carlos",
                last_name: "Martínez",
                phone: 12345678,
                country: "Guatemala",
                identification_type: "DPI",
                identification: "3456789010123",
                nit: "3456789-0",
                igss: 90123456,
                gender: "Masculino",
                birthdate: "1985-11-05",
                address: "8a Calle 5-67 Zona 9, Ciudad de Guatemala",
                hire_date: "2018-04-23",
                contract_type: "Tiempo Completo",
                work_day: "Ordinaria",
                status: true,
                departmentId: 3,
                areaId: 1
            }),
            EmployeeSchema.create({
                name: "Sofía",
                last_name: "Ramírez",
                phone: "55523456",
                country: "Guatemala",
                identification_type: "DPI",
                identification: "3456789012234",
                nit: "3456789-0",
                igss: "90123456",
                gender: "Femenino",
                birthdate: "1985-11-05",
                address: "8a Calle 5-67 Zona 9, Ciudad de Guatemala",
                hire_date: "2018-04-23",
                contract_type: "Contrato",
                work_day: "Medio Tiempo",
                status: true,
                departmentId: 3,
                areaId: 3
            }),
            EmployeeSchema.create({
                name: "Pedro",
                last_name: "Gómez",
                phone: "55523456",
                country: "Guatemala",
                identification_type: "DPI",
                identification: "3456789012234",
                nit: "3456789-0",
                igss: "90123456",
                gender: "Masculino",
                birthdate: "1985-11-05",
                address: "8a Calle 5-67 Zona 9, Ciudad de Guatemala",
                hire_date: "2018-04-23",
                contract_type: "Indefinido",
                work_day: "Continua",
                status: true,
                departmentId: 4,
                areaId: 1
            }),
            EmployeeSchema.create({
                name: "Roberto",
                last_name: "Jiménez",
                phone: "55534567",
                country: "Guatemala",
                identification_type: "DPI",
                identification: "4567890123345",
                nit: "4567890-1",
                igss: "01234567",
                gender: "Masculino",
                birthdate: "1982-09-15",
                address: "10a Avenida 8-90 Zona 13, Ciudad de Guatemala",
                hire_date: "2017-09-01",
                contract_type: "Tiempo Completo",
                work_day: "Nocturna",
                status: true,
                departmentId: 4,
                areaId: 2
            }), 
        ])
    } catch (error) {
        console.log(error);
    }
}