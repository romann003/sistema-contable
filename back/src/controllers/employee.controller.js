import { parse, format } from 'date-fns';
import { EmployeeSchema } from "../models/Employee.js";

const timeZone = 'America/Guatemala';

export const createEmployee = async (req, res) => {
    const { name, last_name, phone, country, identification_type, identification, nit, igss, gender, birthdate, address, hire_date, contract_type, work_day, status, departmentId, areaId } = req.body;
    try {
        const identificationFound = await EmployeeSchema.findOne({ where: { identification } });
        if (identificationFound) return res.status(400).json(['El documento de identificación ya existe']);

        const newEmployee = new EmployeeSchema({
            name,
            last_name,
            phone,
            country,
            identification_type,
            identification,
            nit,
            igss,
            gender,
            birthdate,
            address,
            hire_date,
            contract_type,
            work_day,
            status
        });

        if (departmentId) {
            newEmployee.departmentId = departmentId;
        } else {
            return res.status(400).json(['Debes de pertenecer a un departamento']);
        }

        if (areaId) {
            newEmployee.areaId = areaId;
        } else {
            return res.status(400).json(['Debes de ingresar un area(cargo) del departamento']);
        }

        const savedEmployee = await newEmployee.save();
        res.status(200).json({ savedEmployee });
        // res.status(200).json({ todayFormat});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getEmployees = async (req, res) => {
    try {
        const employees = await EmployeeSchema.findAll({ include: [{ association: 'department' }, { association: 'area' }], order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] });
        
        if (employees.length === 0) return res.status(404).json({ message: "Empleados no encontrados" });

        const employeesWithFullName = employees.map(employee => ({
            ...employee.toJSON(),
            fullName: `${employee.name} ${employee.last_name}`
        }));

        res.status(200).json(employeesWithFullName);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const getEmployee = await EmployeeSchema.findOne({ where: { id: employeeId } });
        if (!getEmployee) return res.status(404).json({ message: "Empleado no encontrado" });

        res.status(200).json(getEmployee);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateEmployeeById = async (req, res) => {
    try {
        const updatedEmployee = await EmployeeSchema.findByPk(req.params.employeeId);
        if (!updatedEmployee) return res.status(404).json({ message: "Empleado no encontrado" });

        // if (identification) {
        //     const identificationFound = await EmployeeSchema.findOne({ where: { identification } });
        //     if (identificationFound) return res.status(400).json({ message: 'El documento de identificación ya existe' });
        // }

        // if (nit) {
        //     const nitFound = await EmployeeSchema.findOne({ where: { nit } });
        //     if (nitFound) return res.status(400).json(['El nit ya existe']);
        // }

        updatedEmployee.set(req.body);
        await updatedEmployee.save();
        res.status(200).json(updatedEmployee);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const deleteEmployee = await EmployeeSchema.destroy({ where: { id: employeeId } });
        if (!deleteEmployee) return res.status(404).json({ message: "Empleado no encontrado" });
        res.status(200).json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}