import { NominaSchema } from "../models/Nomina.js";
import { BonificacionSchema } from "../models/NominaDatos.js";

export const createNomina = async (req, res) => {
    try {
        const { cantidad_horas_extra, sueldo_horas_extra, vacaciones_pagadas, isr, igss_patronal, igss_laboral, prestamos, anticipo_salario, employeeId, companyId, periodoId } = req.body;

        if (!periodoId)  {
            return res.status(400).json(['Debes de seleccionar un periodo']);
        }

        if (!employeeId) {
            return res.status(400).json(['Debes de ingresar un empleado']);
        }

        if (!companyId) {
            return res.status(400).json(['Debes de ingresar una empresa']);
        }

        let newNomina = new NominaSchema({
            cantidad_horas_extra,
            sueldo_horas_extra,
            vacaciones_pagadas,

            isr,
            igss_patronal,
            igss_laboral,
            prestamos,
            anticipo_salario,
            periodoId,
            employeeId,
            companyId
        });

        // await calcularTotales(newNomina);
        
        const savedNomina = await newNomina.save();

        res.status(200).json( savedNomina );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getNominas = async (req, res) => {
    try {
        const nominas = await NominaSchema.findAll(
            {
                include: [
                    {
                        association: 'employee',
                        include: [
                            { association: 'department' },
                            { association: 'area' }
                        ]
                    },
                    { association: 'bonificacions'},
                    { association: 'periodo' },
                    { association: 'company' }], order: [['createdAt' && 'updatedAt', 'DESC']]
            });
        if (nominas.length === 0) return res.status(404).json({ message: "Nominas no encontradas" });
        res.status(200).json(nominas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// export const getNominas = async (req, res) => {
//     try {
//         const nominas = await NominaSchema.findAll(
//             {
//                 include: [
//                     {
//                         association: 'employee',
//                         include: [
//                             { association: 'department' },
//                             { association: 'area' }
//                         ]
//                     },
//                     { association: 'bonificacions'},
//                     { association: 'periodo' },
//                     { association: 'company' }], order: [['createdAt' && 'updatedAt', 'DESC']]
//             });
//         if (nominas.length === 0) return res.status(404).json({ message: "Nominas no encontradas" });
//         res.status(200).json(nominas);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

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
        const updatedNomina = await NominaSchema.findByPk(req.params.nominaId, { include: [{ association: 'bonificacions' }] });
        if (!updatedNomina) return res.status(404).json({ message: "Nomina no encontrada" });

        // if (updatedNomina.bonificacions.length > 0) {
        //     const bonificaciones = await BonificacionSchema.destroy({ where: { nominaId: req.params.nominaId } });
        // }

        

        updatedNomina.set(req.body);
        // await calcularTotales(updatedNomina);
        await updatedNomina.save();

        res.status(200).json(updatedNomina);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteNominaById = async (req, res) => {
    try {
        const { nominaId } = req.params;
        const deletedNomina = await NominaSchema.findByPk(nominaId, { include: [{ association: 'bonificacions' }] });
        if (!deletedNomina) return res.status(404).json({ message: "Nomina no encontrada" });

        if (deletedNomina.bonificacions.length > 0) {
            const bonificaciones = await BonificacionSchema.destroy({ where: { nominaId: nominaId } });
            
            // .findAll({ where: { nominaId: nominaId } });
            // bonificaciones.map(async (bonificacion) => {
            //     await bonificacion.destroy();
            // });
        }

        await deletedNomina.destroy();
        // return res.status(400).json({ message: "No se puede eliminar la nomina porque tiene bonificaciones asociadas" });
        
        res.status(200).json({ message: "Nomina eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}