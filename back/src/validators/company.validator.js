import { check } from 'express-validator';
import { CompanySchema } from '../models/Company.js';
import { validateResult } from '../middlewares/validate.js';

export const validateCompany = () => {
    return [
        check('status').custom(async (value, { req }) => {
            if (value === '') return Promise.reject('el estado no puede estar vacio');
        }),
        check('phone').custom(async (value, { req }) => {
            if (req.body.phone === '') return Promise.reject('El telefono no puede ser vacio');
        }),
        check('address').custom(async (value, { req }) => {
            if (req.body.address === '') return Promise.reject('La dirección no puede ser vacia');
        }),

        allInputValidation(),

        (req, res, next) => {
            validateResult(req, res, next)
        }
    ]
}

const allInputValidation = () => {
    return [
        check('business_name').custom(async (value, { req }) => {
            const id = await CompanySchema.findOne({ where: { id: req.params.companyId } });
            if (id) {
                if (req.body.business_name === '') return Promise.reject('El nombre de la empresa no puede ser vacio');
                if (req.body.business_name) {
                    const business_nameFound = await CompanySchema.findOne({ where: { business_name: req.body.business_name } });
                    if (business_nameFound && business_nameFound.id != id.id) return Promise.reject('Esta empresa ya existe');
                }
            }
        }),
        check('nit').custom(async (value, { req }) => {
            const id = await CompanySchema.findOne({ where: { id: req.params.companyId } });
            if (id) {
                if (req.body.nit === '') return Promise.reject('El nit de la empresa no puede ser vacio');
                if (req.body.nit) {
                    const nitFound = await CompanySchema.findOne({ where: { nit: req.body.nit } });
                    if (nitFound && nitFound.id != id.id) return Promise.reject('Este nit ya existe');
                }
            }
        }),
    ]
}