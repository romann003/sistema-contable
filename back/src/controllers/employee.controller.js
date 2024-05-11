import { EmployeeSchema } from "../models/Employee.js";

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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getEmployees = async (req, res) => {
    try {
        const employees = await EmployeeSchema.findAll();
        if (employees.length === 0) return res.status(404).json({ message: "Empleados no encontrados" });
        res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

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
        // const { name, last_name, phone, country, identification_type, identification, nit, igss, gender, birthdate, address, hire_date, contract_type, work_day, status, departmentId, areaId } = req.body;
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

        // updatedEmployee.name = name;
        // updatedEmployee.last_name = last_name;
        // updatedEmployee.phone = phone;
        // updatedEmployee.country = country;
        // updatedEmployee.identification_type = identification_type;
        // updatedEmployee.identification = identification;
        // updatedEmployee.nit = nit;
        // updatedEmployee.igss = igss;
        // updatedEmployee.gender = gender;
        // updatedEmployee.birthdate = birthdate;
        // updatedEmployee.address = address;
        // updatedEmployee.hire_date = hire_date;
        // updatedEmployee.contract_type = contract_type;
        // updatedEmployee.work_day = work_day;
        // updatedEmployee.status = status;
        // updatedEmployee.departmentId = departmentId;
        // updatedEmployee.areaId = areaId;
        // await updatedEmployee.save();


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
        res.status(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}