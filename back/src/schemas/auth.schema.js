import { z } from 'zod';

// export const loginSchema = z.object({
//     // body: z.object({
//         email: z.string({ required_error: "Email es requerido" }).email({ message: "Email no válido" }),
//         password: z.string({ required_error: "Contraseña es requerida" }).min(6, { message: "La contraseña debe ser de al menos 6 caracteres" })
//     // })
//     // params: z.object({
//     //     id: z.string({ required_error: "Id es requerido" })
//     // })
// })

export const loginSchema = z.object({
    email: z.string({
        required_error: 'Correo electrónico requerido'
    }).email({
        message: 'el correo electrónico no es válido'
    }),
    password: z.string({
        required_error: 'Contraseña requerida'
    }).min(6, {
        'message': 'La contraseña debe ser mayor a 6 caracteres'
    }),
})