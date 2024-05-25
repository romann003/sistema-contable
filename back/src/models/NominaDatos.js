import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { NominaSchema } from "./Nomina.js";

export const PeriodoSchema = sequelize.define("periodo", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    periodo_liquidacion_inicio: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false,
        unique: true,
    },
    periodo_liquidacion_final: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false,
        unique: true,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        required: true,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: true
});

export const BonificacionSchema = sequelize.define("bonificacion", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
    },
    cantidad: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false,
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        },
        beforeUpdate: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        },
        beforeDestroy: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        },
        afterDestroy: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        },
        afterCreate: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        },
        afterUpdate: async (bonificacion) => {
            await bonificacion.calcularYActualizarTotales();
        }
    }
});

BonificacionSchema.prototype.calcularYActualizarTotales = async function () {
    try {
        const nomina = await NominaSchema.findByPk(this.nominaId,
            {
                include: [
                    {
                        association: 'employee',
                        include: [
                            { association: 'area' }
                        ]
                    }
                ]
            });
            
        if (!nomina) throw new Error("Nomina no encontrada");

        const salarioBase = parseFloat(nomina.employee.area.salary || 0);
        const bonificaciones = await BonificacionSchema.findAll({ where: { nominaId: nomina.id } });
        const totalBonificaciones = bonificaciones.reduce((acc, bonificacion) => acc + parseFloat(bonificacion.cantidad || 0), 0);
        
        const totalPercepciones =
            salarioBase +
            // parseFloat(nomina.cantidad_horas_extra || 0) +
            parseFloat(nomina.sueldo_horas_extra || 0) +
            parseFloat(nomina.vacaciones_pagadas || 0) +
            totalBonificaciones;

        const totalDeducciones =
            parseFloat(nomina.isr || 0) +
            parseFloat(nomina.igss_patronal || 0) +
            parseFloat(nomina.igss_laboral || 0) +
            parseFloat(nomina.prestamos || 0) +
            parseFloat(nomina.anticipo_salario || 0);

        const liquidoPercibir = totalPercepciones - totalDeducciones;

        nomina.total_percepciones = totalPercepciones;
        nomina.total_deducciones = totalDeducciones;
        nomina.liquido_percibir = liquidoPercibir;
        nomina.total_bonificaciones = totalBonificaciones;
        await nomina.save();
    } catch (error) {
        console.error("Error al recalcular totales", error);
    }
}