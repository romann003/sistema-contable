import { check } from 'express-validator';
import { validateResult } from '../middlewares/validate.js';
import { DepartmentSchema } from '../models/Department.js';
import { CompanySchema } from '../models/Company.js';

export const validateDepartment = (val) => {
    return [
        check('status').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('el estado no puede estar vacio');
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
            check('name').not().isEmpty().withMessage('El nombre del departamento es obligatorio'),
            check('description').optional(),
            check('companyId').not().isEmpty().withMessage('Requieres de una empresa para asignarle el departamento'),
            check('name').custom(async (value, { req }) => {
                if (req.body.name) {
                    const nameFound = await DepartmentSchema.findOne({ where: { name: req.body.name } });
                    if (nameFound) return Promise.reject('El nombre del departamento ya existe');
                }
            })
        ]
    } else {
        return [
            check('name').custom(async (value, { req }) => {
                const id = await DepartmentSchema.findOne({ where: { id: req.params.departmentId } });
                if (id) {
                    if (req.body.name === '') return Promise.reject('El nombre del departamento no puede ser vacio');
                    if (req.body.name) {
                        const nameFound = await DepartmentSchema.findOne({ where: { name: req.body.name } });
                        if (nameFound && nameFound.id != id.id) return Promise.reject('El nombre del departamento ya existe');
                    }
                }
            })
        ]
    }
}