import { z } from 'zod';

export const areaSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido'
    }).min(3, {
        'message': 'El nombre debe ser mayor a 3 caracteres'
    }),
    salary: z.number({
        required_error: 'El sueldo es requerido'
    }).min(1, {
        'message': 'El sueldo debe ser mayor a 0'
    }),
    departmentId: z.number({
        required_error: 'El id del area (puesto) es requerido'
    })
})