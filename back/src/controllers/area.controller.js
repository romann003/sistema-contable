import { AreaSchema } from "../models/Area.js";

export const createArea = async (req, res) => {
    try {
        const { name, description, salary, status, departmentId } = req.body;

        const newArea = new AreaSchema({
            name,
            description,
            salary,
            status
        });

        if (departmentId) {
            newArea.departmentId = departmentId;
            const savedArea = await newArea.save();
            res.status(200).json({ savedArea });
        } else {
            return res.status(400).json({ message: "Debes de ingresar el id del departamento" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAreas = async (req, res) => {
    try {
        const areas = await AreaSchema.findAll( { include: [{ association: 'department' }] , order: [['createdAt' && 'updatedAt', 'DESC']]} );
        if (areas.length === 0) return res.status(404).json({ message: "No hay areas registradas" });
        res.status(200).json(areas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAreaById = async (req, res) => {
    try {
        const getArea = await AreaSchema.findOne({ where: { id: req.params.areaId } });

        if (!getArea) return res.status(404).json({ message: "Area del departamento no encontrado" });

        res.status(200).json(getArea);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateAreaById = async (req, res) => {
    try {
        const updatedArea = await AreaSchema.findByPk(req.params.areaId);
        if (!updatedArea) return res.status(404).json({ message: "Area del departamento no encontrado" });
        
        updatedArea.set(req.body);
        await updatedArea.save();
        res.status(200).json(updatedArea);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteAreaById = async (req, res) => {
    try {
        const deleteArea = await AreaSchema.destroy({ where: { id: req.params.areaId } });
        if (!deleteArea) return res.status(404).json({ message: "Area del departamento no encontrado" });
        res.status(200).json({ message: "Area eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}