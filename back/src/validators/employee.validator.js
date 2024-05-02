import { check } from 'express-validator';
import { validateResult } from '../middlewares/validate.js';
import { AreaSchema } from '../models/Area.js';
import { DepartmentSchema } from '../models/Department.js';
import { EmployeeSchema } from '../models/Employee.js';

export const validateEmployee = (val) => {
    return [
        check('status').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('el estado no puede estar vacio');
        }),
        check('departmentId').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('Requieres de un departamento');
            if (value) {
                const departmentFound = await DepartmentSchema.findOne({ where: { id: value } });
                if (!departmentFound) return Promise.reject('El departamento no existe');
                if (!departmentFound.status) return Promise.reject('El departamento no se encuentra activo');
            }
        }),
        check('areaId').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('Requieres de un area');
            if (value) {
                const areaFound = await AreaSchema.findOne({ where: { id: value } });
                if (!areaFound) return Promise.reject('El area no existe');
                if (!areaFound.status) return Promise.reject('El area no se encuentra activa');
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
            check('phone').not().isEmpty().withMessage('El telefono es obligatorio'),
            check('country').not().isEmpty().withMessage('El pais es obligatorio'),
            check('identification_type').not().isEmpty().withMessage('El tipo de identificacion es obligatorio'),
            check('identification').not().isEmpty().withMessage('El numero de identificacion es obligatorio'),
            check('nit').not().isEmpty().withMessage('El nit es obligatorio'),
            check('igss').not().isEmpty().withMessage('El igss es obligatorio'),
            check('gender').not().isEmpty().withMessage('El genero es obligatorio'),
            check('birthdate').not().isEmpty().withMessage('La fecha de nacimiento es obligatorio'),
            check('address').not().isEmpty().withMessage('La dirección es obligatoria'),
            check('hire_date').not().isEmpty().withMessage('La fecha de contratacion es obligatoria'),
            check('contract_type').not().isEmpty().withMessage('El tipo de contrato es obligatorio'),
            check('work_day').not().isEmpty().withMessage('Los dias laborales son obligatorios'),
            check('departmentId').not().isEmpty().withMessage('El departamento es obligatorio'),
            check('areaId').not().isEmpty().withMessage('El area es obligatorio'),

            check('phone').custom(async (value, { req }) => {
                if (value) {
                    const phoneFound = await EmployeeSchema.findOne({ where: { phone: value } });
                    if (phoneFound) return Promise.reject('El numero de telefono ya existe');
                }
            }),
            check('identification').custom(async (value, { req }) => {
                if (value) {
                    const identificationFound = await EmployeeSchema.findOne({ where: { identification: value } });
                    if (identificationFound) return Promise.reject('El numero de identificacion ya existe');
                }
            }),
            check('nit').custom(async (value, { req }) => {
                if (value) {
                    const nitFound = await EmployeeSchema.findOne({ where: { nit: value } });
                    if (nitFound) return Promise.reject('El nit ya existe');
                }
            }),
            check('igss').custom(async (value, { req }) => {
                if (value) {
                    const igssFound = await EmployeeSchema.findOne({ where: { igss: value } });
                    if (igssFound) return Promise.reject('El igss ya existe');
                }
            })
        ]
    } else {
        return [
            // check('name').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el nombre no puede ser vacio');
            // }),
            // check('last_name').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el apellido no puede ser vacio');
            // }),
            // check('country').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el pais no puede ser vacio');
            // }),
            // check('identification_type').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el tipo de identificacion no puede ser vacio');
            // }),
            // check('gender').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el genero no puede ser vacio');
            // }),
            // check('birthdate').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('la fecha de nacimiento no puede ser vacia');
            // }),
            // check('address').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('la dirección no puede ser vacia');
            // }),
            // check('hire_date').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('la fecha de contratacion no puede ser vacia');
            // }),
            // check('contract_type').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('el tipo de contrato no puede ser vacio');
            // }),
            // check('work_day').custom(async (value, { req }) => {
            //     if (value === '') return Promise.reject('los dias laborales no pueden ser vacios');
            // }),

            check('phone').custom(async (value, { req }) => {
                const id = await EmployeeSchema.findOne({ where: { id: req.params.employeeId } });
                if (id) {
                    if (value === '') return Promise.reject('el telefono no puede ser vacio');
                    if (value) {
                        const phoneFound = await EmployeeSchema.findOne({ where: { phone: value } });
                        if (phoneFound && phoneFound.id != id.id) return Promise.reject('El numero de telefono ya existe');
                    }
                }
            }),
            check('identification').custom(async (value, { req }) => {
                const id = await EmployeeSchema.findOne({ where: { id: req.params.employeeId } });
                if (id) {
                    if (value === '') return Promise.reject('el numero de identificacion no puede ser vacio');
                    if (value) {
                        const identificationFound = await EmployeeSchema.findOne({ where: { identification: value } });
                        if (identificationFound && identificationFound.id != id.id) return Promise.reject('El numero de identificacion ya existe');
                    }
                }
            }),
            check('nit').custom(async (value, { req }) => {
                const id = await EmployeeSchema.findOne({ where: { id: req.params.employeeId } });
                if (id) {
                    if (value === '') return Promise.reject('el nit no puede ser vacio');
                    if (value) {
                        const nitFound = await EmployeeSchema.findOne({ where: { nit: value } });
                        if (nitFound && nitFound.id != id.id) return Promise.reject('El nit ya existe');
                    }
                }
            }),
            check('igss').custom(async (value, { req }) => {
                const id = await EmployeeSchema.findOne({ where: { id: req.params.employeeId } });
                if (id) {
                    if (value === '') return Promise.reject('el igss no puede ser vacio');
                    if (value) {
                        const igssFound = await EmployeeSchema.findOne({ where: { igss: value } });
                        if (igssFound && igssFound.id != id.id) return Promise.reject('El igss ya existe');
                    }
                }
            })
        ]
    }
}