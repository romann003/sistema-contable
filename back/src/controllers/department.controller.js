import { DepartmentSchema } from "../models/Department.js";

export const createDepartment = async (req, res) => {
    try {
        const { name, description, status, companyId } = req.body;

        const newDepartment = new DepartmentSchema({
            name,
            description,
            status
        });

        if (companyId) {
            newDepartment.companyId = companyId;
        } else {
            newDepartment.companyId = 1;
        }

        const savedDepartment = await newDepartment.save();
        res.status(200).json({ savedDepartment });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getDepartments = async (req, res) => {
    try {
        const departments = await DepartmentSchema.findAll();
        if (departments.length === 0) return res.status(404).json({ message: "No hay departamentos registrados" });
        res.status(200).json(departments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getDepartmentById = async (req, res) => {
    try {
        const getDepartment = await DepartmentSchema.findOne({ where: { id: req.params.departmentId } });

        if (!getDepartment) return res.status(404).json({ message: "Departamento no encontrado" });

        res.status(200).json(getDepartment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateDepartmentById = async (req, res) => {
    try {
        const updatedDepartment = await DepartmentSchema.findByPk(req.params.departmentId);
        if (!updatedDepartment) return res.status(404).json({ message: "Departamento no encontrado" });

        updatedDepartment.set(req.body);
        await updatedDepartment.save();
        res.status(200).json(updatedDepartment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteDepartmentById = async (req, res) => {
    try {
        const deleteDepartment = await DepartmentSchema.destroy({ where: { id: req.params.departmentId } });
        if (!deleteDepartment) return res.status(404).json({ message: "Departamento no encontrado" });
        res.status(200).json({ message: "Departamento eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}