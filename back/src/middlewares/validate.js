import {validationResult} from 'express-validator';

export const validateResult = (req, res, next) => {
    try {
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const checkError = errors.array().map(error => error.msg);
                return res.status(403).json({ errors: errors.array().map(error => error.msg) });
            }
            next();
    } catch (error) {
        res.status(403).send({ errors: error.array().map(error => error.msg) });
    }
}