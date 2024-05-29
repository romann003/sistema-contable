import { PeriodoSchema } from "../models/NominaDatos.js";

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