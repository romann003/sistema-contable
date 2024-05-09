import { z } from 'zod';

export const userSchema = z.object({
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