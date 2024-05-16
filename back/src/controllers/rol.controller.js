import { Op } from 'sequelize';
import { RolSchema } from "../models/Rol.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await RolSchema.findAll({
            where: {
                name: {
                    [Op.not]: 'root'
                }
            }
        });
        
        if (roles.length === 0) return res.status(404).json({ message: "No se pueden cargar los roles" });
        
        res.status(200).json(roles);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}
