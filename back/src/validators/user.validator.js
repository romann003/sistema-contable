import { check } from 'express-validator';
import { validateResult } from '../middlewares/validate.js';
import { UserSchema } from '../models/User.js';
import { RolSchema } from '../models/Rol.js';
import { CompanySchema } from '../models/Company.js';

export const validateUser = (val) => {
    return [
        check('status').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('el estado no puede estar vacio');
        }),
        check('rolId').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('Requieres de un rol');
            if (value) {
                const rolFound = await RolSchema.findOne({ where: { id: value } });
                if (!rolFound) return Promise.reject('El rol no existe');
                if (!rolFound.status) return Promise.reject('El rol no se encuentra activo');
            }
        }),
        check('companyId').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('Requieres de una empresa');
            if (value) {
                const companyFound = await CompanySchema.findOne({ where: { id: value } });
                if (!companyFound) return Promise.reject('La empresa no existe');
                if (!companyFound.status) return Promise.reject('La empresa no se encuentra activa');
            }
        }),
        allInputValidation(val),

        (req, res, next) => {
            validateResult(req, res, next)
        }
    ]
}

const allInputValidation = (val) => {
    if (val === 1) {
        return [
            check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
            check('last_name').not().isEmpty().withMessage('El apellido es obligatorio'),
            check('username').not().isEmpty().withMessage('El nombre de usuario es obligatorio'),
            check('email').not().isEmpty().withMessage('El correo electrónico es obligatorio'),
            check('password').not().isEmpty().withMessage('La contraseña es obligatoria'),
            check('username').custom(async (value, { req }) => {
                if (value) {
                    const usernameFound = await UserSchema.findOne({ where: { username: value } });
                    if (usernameFound) return Promise.reject('El nombre de usuario ya existe');
                }
            }),
            check('email').custom(async (value, { req }) => {
                if (value) {
                    const emailFound = await UserSchema.findOne({ where: { email: value } });
                    if (emailFound) return Promise.reject('El correo electrónico ya existe');
                }
            })
        ]
    } else {
        return [
            check('name').custom(async (value, { req }) => {
                if (value === '') return Promise.reject('el nombre no puede ser vacio');
            }),
            check('last_name').custom(async (value, { req }) => {
                if (value === '') return Promise.reject('el apellido no puede ser vacio');
            }),
            check('username').custom(async (value, { req }) => {
                const id = await UserSchema.findOne({ where: { id: req.params.userId } });
                if (id) {
                    if (value === '') return Promise.reject('El nombre de usuario no puede ser vacio');
                    if (value) {
                        const usernameFound = await UserSchema.findOne({ where: { username: value } });
                        if (usernameFound && usernameFound.id != id.id) return Promise.reject('El nombre de usuario ya existe');
                    }
                }
            }),
            check('email').custom(async (value, { req }) => {
                const id = await UserSchema.findOne({ where: { id: req.params.userId } });
                if (id) {
                    if (value === '') return Promise.reject('El correo electronico no puede ser vacio');
                    if (value) {
                        const emailFound = await UserSchema.findOne({ where: { email: value } });
                        if (emailFound && emailFound.id != id.id) return Promise.reject('El correo electronico ya existe');
                    }
                }
            }),
            check('password').custom(async (value, { req }) => {
                if (value === '') return Promise.reject('La contraseña no puede ser vacia');
            })
        ]
    }
}