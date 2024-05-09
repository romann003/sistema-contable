import { z } from 'zod';
import { UserSchema } from '../models/User.js';

export const userSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido'
    }).min(3, {
        'message': 'El nombre debe ser mayor a 3 caracteres'
    }),
    last_name: z.string({
        required_error: 'El apellido es requerido'
    }).min(3, {
        'message': 'El apellido debe ser mayor a 3 caracteres'
    }),
    username: z.string({
        required_error: 'El nombre de usuario es requerido'
    }).min(3, {
        'message': 'El nombre de usuario debe ser mayor a 3 caracteres'
    }),
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