import { PeriodoSchema } from "../models/NominaDatos.js";
import { DepartmentSchema } from "../models/Department.js";
import { AreaSchema } from "../models/Area.js";
import { EmployeeSchema } from "../models/Employee.js";
import { NominaSchema } from "../models/Nomina.js";
import { Op } from "sequelize";

// Nuevo periodo liquidacion
export const createNuevoPeriodo = async (req, res) => {
    try {
        const { periodo_liquidacion_inicio, periodo_liquidacion_final, fecha_pago, status } = req.body;

        // const isPeriodo = await PeriodoSchema.findOne({
        //     where: { periodo_liquidacion_inicio, periodo_liquidacion_final }
        // });

        // if (isPeriodo) return res.status(400).json({ message: "El periodo de liquidacion ya existe" });

        const newPeriodo = new PeriodoSchema({
            periodo_liquidacion_inicio,
            periodo_liquidacion_final,
            fecha_pago,
            status
        });


        // if (periodo_liquidacion_inicio >= periodo_liquidacion_final) return res.status(400).json({ message: "La fecha de inicio no puede ser mayor o igual a la fecha final" });

        // if (fecha_pago >= periodo_liquidacion_final) return res.status(400).json({ message: "La fecha de pago no puede ser mayor o igual a la fecha final" });

        // if (fecha_pago <= periodo_liquidacion_inicio) return res.status(400).json({ message: "La fecha de pago no puede ser menor o igual a la fecha de inicio" });

        // if (fecha_pago === periodo_liquidacion_inicio) return res.status(400).json({ message: "La fecha de pago no puede ser igual a la fecha de inicio" });

        // if (fecha_pago === periodo_liquidacion_final) return res.status(400).json({ message: "La fecha de pago no puede ser igual a la fecha final" });

        // if (periodo_liquidacion_inicio === periodo_liquidacion_final) return res.status(400).json({ message: "La fecha de inicio no puede ser igual a la fecha final" });

        // if (!periodo_liquidacion_inicio || !periodo_liquidacion_final || !fecha_pago) return res.status(400).json({ message: "Todos los campos son requeridos" });

        // if (periodo_liquidacion_inicio === fecha_pago) return res.status(400).json({ message: "La fecha de inicio no puede ser igual a la fecha de pago" });

        // if (periodo_liquidacion_final === fecha_pago) return res.status(400).json({ message: "La fecha final no puede ser igual a la fecha de pago" });

        const savedPeriodo = await newPeriodo.save();
        res.status(200).json({ savedPeriodo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPeriodos = async (req, res) => {
    try {
        const periodos = await PeriodoSchema.findAll({ order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] });
        if (periodos.length === 0) return res.status(404).json({ message: "Periodos de liquidacion no encontrados" });

        // const periodosWithRange = periodos.map(periodoL => ({
        //     ...periodoL.toJSON(),
        //     rangoFechas: `${periodoL.periodo_liquidacion_inicio} ${periodoL.periodo_liquidacion_final}`
        // }));

        res.status(200).json(periodos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updatePeriodoById = async (req, res) => {
    try {
        const updatedPeriodo = await PeriodoSchema.findByPk(req.params.periodoId);
        if (!updatedPeriodo) return res.status(404).json({ message: "Periodo de liquidacion no encontrado" });

        updatedPeriodo.set(req.body);
        await updatedPeriodo.save();

        res.status(200).json(updatedPeriodo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deletePeriodoById = async (req, res) => {
    try {
        const deletePeriodo = await PeriodoSchema.findByPk(req.params.periodoId, { include: [{ association: 'nominas' }] }
        );
        if (!deletePeriodo) return res.status(404).json({ message: "Periodo de liquidacion no encontrado" });

        if (deletePeriodo.nominas.length > 0) { res.status(400).json({ message: "No se puede eliminar este periodo porque tiene registros contables asociados" }) }
        else {
            await deletePeriodo.destroy();
            res.status(200).json({ message: "Periodo de liquidación eliminado correctamente" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const calcularTotales = async (req, res) => {
    try {
        const totalDepartamentos = await DepartmentSchema.count();
        const totalAreas = await AreaSchema.count();
        const totalEmpleados = await EmployeeSchema.count();
        const totalNomina = await NominaSchema.count();

        const totalDepartamentosActivos = await DepartmentSchema.count({ where: { status: true } });
        const totalDepartamentosInactivos = await DepartmentSchema.count({ where: { status: false } });
        const totalAreasActivas = await AreaSchema.count({ where: { status: true } });
        const totalAreasInactivas = await AreaSchema.count({ where: { status: false } });
        const totalEmpleadosActivos = await EmployeeSchema.count({ where: { status: true } });
        const totalEmpleadosInactivos = await EmployeeSchema.count({ where: { status: false } });

        const totalNominasMes = await NominaSchema.count({ where: { createdAt: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) } } });
        const totalNominasSemana = await NominaSchema.count({ where: { createdAt: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) } } });
        const totalNominasHoy = await NominaSchema.count({ where: { createdAt: { [Op.gte]: new Date(new Date().setDate(new Date().getDate())) } } });
        const totalNominasRangoFechas = await NominaSchema.count(
            {
                include: [{
                    association: 'periodo',
                    where: {
                        periodo_liquidacion_inicio: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) },
                        periodo_liquidacion_final: { [Op.lte]: new Date(new Date().setDate(new Date().getDate())) }
                    }
                }
                ]

            }
        );

        const totales = {
            totalDepartamentos,
            totalDepartamentosActivos,
            totalDepartamentosInactivos,
            totalAreas,
            totalAreasActivas,
            totalAreasInactivas,
            totalEmpleados,
            totalEmpleadosActivos,
            totalEmpleadosInactivos,
            totalNomina,
            totalNominasMes,
            totalNominasSemana,
            totalNominasHoy,
            totalNominasRangoFechas
        }

        return res.status(200).json(totales);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}