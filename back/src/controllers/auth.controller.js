import { UserSchema, comparePassword } from "../models/User.js";
// import config from '../config.js'
// import jwt from 'jsonwebtoken'
import { createAccessToken } from "../libs/jwt.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const userFound = await UserSchema.findOne({ where: { email }, include: [{ association: 'rol' }] });
        if (!userFound) return res.status(400).json({ message: "Usuario y/o Contraseña incorrectos" });
        const matchPassword = await comparePassword(password, userFound.password);
        if (!matchPassword) return res.status(401).json({ token: null, message: "Usuario y/o Contraseña incorrectos" });
        if (!userFound.status) return res.status(400).json({ message: "El sistema no se encuentra activo" });
    
        // const token = jwt.sign({ id: userFound.id }, config.SECRET, {
        //     expiresIn: 86400 //24 hours
        // })
        // res.json({ token });
    
        const token = await createAccessToken({ id: userFound.id });
        res.cookie("token", token);
        res.json({ message: "Sesión iniciada" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0)});
    return res.status(200).json({ message: "Sesión finalizada" });
}