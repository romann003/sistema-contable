import { NominaSchema } from "../models/Nomina.js";

export const createNomina = async (req, res) => {
    try {
        const { bonificacion, horas_extra, vacaciones_pagadas, aguinaldo, total_percepciones, isr, igss_patronal, igss_laboral, prestamos, total_deducciones, liquido_percibir, periodo_liquidacion_inicio, periodo_liquidacion_final, fecha_pago, status, employeeId, companyId } = req.body;

        const newNomina = new NominaSchema({
            bonificacion,
            horas_extra,
            vacaciones_pagadas,
            aguinaldo,
            total_percepciones,
            isr,
            igss_patronal,
            igss_laboral,
            prestamos,
            total_deducciones,
            liquido_percibir,
            periodo_liquidacion_inicio,
            periodo_liquidacion_final,
            fecha_pago,
            status,
        });

        if (employeeId) {
            newNomina.employeeId = employeeId;
        } else {
            return res.status(400).json(['Debes de ingresar un empleado']);
        }

        if (companyId) {
            newNomina.companyId = companyId;
        } else {
            return res.status(400).json(['Debes de ingresar una empresa']);
        }

        const savedNomina = await newNomina.save();

        res.status(200).json({ savedNomina });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getNominas = async (req, res) => {
    try {
        const nominas = await NominaSchema.findAll({ include: [{ association: 'employee' }, { association: 'company' }], order: [['createdAt' && 'updatedAt', 'DESC']]});
        if (nominas.length === 0) return res.status(404).json({ message: "Nominas no encontradas" });
        res.status(200).json(nominas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getNominaById = async (req, res) => {
    try {
        const { nominaId } = req.params;
        const getNomina = await NominaSchema.findOne({ where: { id: nominaId }, include: [{ association: 'employee' }, { association: 'company' }] });
        if (!getNomina) return res.status(404).json({ message: "Nomina no encontrada" });

        res.status(200).json(getNomina);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateNominaById = async (req, res) => {
    try {
        const updatedNomina = await NominaSchema.findByPk(req.params.nominaId);
        if (!updatedNomina) return res.status(404).json({ message: "Nomina no encontrada" });

        updatedNomina.set(req.body);
        await updatedNomina.save();

        res.status(200).json(updatedNomina);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteNominaById = async (req, res) => {
    try {
        const { nominaId } = req.params;
        const deletedNomina = await NominaSchema.destroy({ where: { id: nominaId } });
        if (!deletedNomina) return res.status(404).json({ message: "Nomina no encontrada" });
        res.status(200).json({ message: "Nomina eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}