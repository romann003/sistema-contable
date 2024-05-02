// CONFIRMACION DE TOKEN (CONFIRMA SI EL USUARIO NOS ESTA ENVIANDO SU TOKEN (validacion de roles))
import jwt from "jsonwebtoken"
import config from "../config.js"
import { UserSchema } from "../models/User.js"
import { RolSchema } from "../models/Rol.js"

// export const verifyToken = async (req, res, next) => {
//     try {
//         // const token = req.headers["x-access-token"]

//         if (!token) return res.status(403).json({ message: "No hay token, autorizacion denegada" })

//         const decoded = jwt.verify(token, config.SECRET)
//         req.userId = decoded.id

//         const user = await UserSchema.findByPk(req.userId, { password: 0 });
//         if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

//         next()
//     } catch (error) {
//         return res.status(401).json({ message: "No autorizado" })
//     }
// }


export const verifyToken = async (req, res, next) => {
    try {
        const {token} = req.cookies

        if (!token) return res.status(401).json({ message: "No hay token, autorizacion denegada" })

        jwt.verify(token, config.SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Token invalido" })
            req.userId = decoded.id
        })

        const user = await UserSchema.findByPk(req.userId, { password: 0 });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

        next()
    } catch (error) {
        return res.status(401).json({ message: "No autorizado" })
    }
}

export const isAdmin = async (req, res, next) => {
    const user = await UserSchema.findByPk(req.userId)
    const roles = await RolSchema.findAll({ where: { id: user.rolId } });
    if (roles.length === 0) {
        return res.status(403).json({ message: "No autorizado" })
    }

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "administrador") {
            next()
            return;
        }
    }
    return res.status(403).json({ message: "No tienes los permisos necesarios para realizar esta accion" })
}

export const isModerator = async (req, res, next) => {
    const user = await UserSchema.findByPk(req.userId)
    const roles = await RolSchema.findAll({ where: { id: user.rolId } });
    if (roles.length === 0) {
        return res.status(403).json({ message: "No autorizado" })
    }

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderador") {
            next()
            return;
        }
    }
    return res.status(403).json({ message: "No tienes los permisos necesarios para realizar esta accion" })
}