import { NominaSchema } from "../models/Nomina.js";
import { PeriodoSchema, BonificacionSchema } from "../models/NominaDatos.js";

// Nuevo periodo liquidacion
export const createNuevoPeriodo = async (req, res) => {
    try {
        const { periodo_liquidacion_inicio, periodo_liquidacion_final, fecha_pago, status } = req.body;

        const isPeriodo = await PeriodoSchema.findOne({
            where: { periodo_liquidacion_inicio, periodo_liquidacion_final }
        });

        if (isPeriodo) return res.status(400).json({ message: "El periodo de liquidacion ya existe" });

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
        const periodosLiquidacion = await PeriodoSchema.findAll({ order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] });
        if (periodosLiquidacion.length === 0) return res.status(404).json({ message: "Periodos de liquidacion no encontrados" });

        // const periodosWithRange = periodosLiquidacion.map(periodoL => ({
        //     ...periodoL.toJSON(),
        //     rangoFechas: `${periodoL.periodo_liquidacion_inicio} ${periodoL.periodo_liquidacion_final}`
        // }));

        res.status(200).json(periodosLiquidacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updatePeriodo = async (req, res) => {
    try {
        const periodoLiquidacion = await PeriodoSchema.findByPk(req.params.periodoLiquidacionId);
        if (!periodoLiquidacion) return res.status(404).json({ message: "Periodo de liquidacion no encontrado" });

        periodoLiquidacion.set(req.body);
        await periodoLiquidacion.save();

        res.status(200).json(periodoLiquidacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deletePeriodo = async (req, res) => {
    try {
        const periodoLiquidacion = await PeriodoSchema.findByPk(req.params.periodoLiquidacionId,
            { include: [{ association: 'nominas' }] }
        );
        if (!periodoLiquidacion) return res.status(404).json({ message: "Periodo de liquidacion no encontrado" });

        if (periodoLiquidacion.nominas.length > 0) { res.status(400).json({ message: "No se puede eliminar este periodo porque tiene registros contables asociados" }) }
        else {
            await periodoLiquidacion.destroy();
            res.status(200).json({ message: "Periodo de liquidación eliminado correctamente" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Bonificaciones

export const createBonificaciones = async (req, res) => {
    try {
        const { descripcion, cantidad, nominaId } = req.body;

        const newBonificacion = new BonificacionSchema({
            descripcion,
            cantidad,
            nominaId
        });

        const isNomina = await NominaSchema.findOne({ where: { id: req.body.nominaId } });
        if (!isNomina) return res.status(404).json({ message: "Nomina no encontrada" });

        const savedBonificacion = await newBonificacion.save();

        res.status(200).json({ savedBonificacion });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getBonificaciones = async (req, res) => {
    try {
        const bonificaciones = await BonificacionSchema.findAll({ order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] });
        if (bonificaciones.length === 0) return res.status(404).json({ message: "Bonificaciones no encontradas" });
        res.status(200).json(bonificaciones);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateBonificacionById = async (req, res) => {
    try {
        const bonificacion = await BonificacionSchema.findByPk(req.params.bonificacionId);
        if (!bonificacion) return res.status(404).json({ message: "Bonificacion no encontrada" });

        bonificacion.set(req.body);
        await bonificacion.save();

        res.status(200).json(bonificacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteBonificacionById = async (req, res) => {
    try {
        const bonificacion = await BonificacionSchema.findByPk(req.params.bonificacionId);
        if (!bonificacion) return res.status(404).json({ message: "Bonificacion no encontrada" });

        await bonificacion.destroy();
        res.status(200).json({ message: "Bonificacion eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}