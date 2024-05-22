import config from '../config.js'
import jwt from 'jsonwebtoken'

export function createAccessToken(payload) {
    try {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, config.SECRET, {
                expiresIn: 86400 //24 hours
            },
                (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                }
            );
        })
    } catch (error) {
        return error;
    }

}
