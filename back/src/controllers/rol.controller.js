import { RolSchema } from "../models/Rol.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await RolSchema.findAll();
        if (roles.length === 0) return res.status(404).json({ message: "No hay roles registrados" });
        res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}