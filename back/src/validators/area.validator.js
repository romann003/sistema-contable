import { check } from 'express-validator';
import { validateResult } from '../middlewares/validate.js';
import { AreaSchema } from '../models/Area.js';
import { DepartmentSchema } from '../models/Department.js';

export const validateArea = (val) => {
    return [
        check('description').optional(),
        check('status').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('el estado no puede estar vacio');
        }),
        check('departmentId').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('Requieres de un departamento para asignarle el area (puesto)');
            if (value) {
                const departmentFound = await DepartmentSchema.findOne({ where: { id: value } });
                if (!departmentFound) return Promise.reject('El departamento no existe');
                if (!departmentFound.status) return Promise.reject('El departamento no se encuentra activo');
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
            check('name').not().isEmpty().withMessage('El nombre del area (puesto) es obligatorio'),
            check('salary').not().isEmpty().withMessage('El sueldo del area (puesto) es obligatorio'),
            check('departmentId').not().isEmpty().withMessage('Requieres de un departamento para asignarle el area (puesto)'),
            check('name').custom(async (value, { req }) => {
                if (req.body.name) {
                    const nameFound = await AreaSchema.findOne({ where: { name: req.body.name } });
                    if (nameFound) return Promise.reject('El nombre del area (puesto) ya existe');
                }
            })
        ]
    } else {
        return [
            check('name').custom(async (value, { req }) => {
                const id = await AreaSchema.findOne({ where: { id: req.params.areaId } });
                if (id) {
                    if (value === '') return Promise.reject('El nombre del area (puesto) no puede ser vacio');
                    if (value) {
                        const nameFound = await AreaSchema.findOne({ where: { name: value } });
                        if (nameFound && nameFound.id != id.id) return Promise.reject('El nombre del area (puesto) ya existe');
                    }
                }
            }),
            check('salary').custom(async (value, { req }) => {
                const id = await AreaSchema.findOne({ where: { id: req.params.areaId } });
                if (id) {
                    if (value === '') return Promise.reject('El sueldo del area (puesto) no puede ser vacio');
                    if (value) {
                        const salaryFound = await AreaSchema.findOne({ where: { salary: value } });
                        if (salaryFound && salaryFound.id != id.id) return Promise.reject('El sueldo del area (puesto) ya existe');
                    }
                }
            })
        ]
    }
}