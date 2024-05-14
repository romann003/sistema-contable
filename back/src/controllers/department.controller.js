import { AreaSchema } from "../models/Area.js";
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
        const departments = await DepartmentSchema.findAll({ include: [{ association: 'company' }], order: [['createdAt' && 'updatedAt', 'DESC']]});
        // const departments = await DepartmentSchema.findAll({where: { status: true } });
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
        if (req.body.status === false) {
            await AreaSchema.update({ status: false }, { where: { departmentId: req.params.departmentId } });
        }
        await updatedDepartment.save();
        res.status(200).json(updatedDepartment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteDepartmentById = async (req, res) => {
    try {
        const deleteDepartment = await DepartmentSchema.findByPk(req.params.departmentId, { include: [{ association: 'areas' }] });
        if (!deleteDepartment) {return res.status(404).json({ message: "Departamento no encontrado" })}
        if (deleteDepartment.areas.length > 0) {res.status(400).json({ message: "No se puede eliminar el departamento porque tiene areas asociadas" })}
        else {
            await deleteDepartment.destroy();
            res.status(200).json({ message: "Departamento eliminado correctamente" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}