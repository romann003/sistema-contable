import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { CompanySchema } from "./Company.js";
import { EmployeeSchema } from "./Employee.js";
import { PeriodoSchema, BonificacionSchema } from "./NominaDatos.js";
import { AreaSchema } from "./Area.js";

export const NominaSchema = sequelize.define("nomina", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad_horas_extra: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    sueldo_horas_extra: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    vacaciones_pagadas: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    total_percepciones: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true // Se calcula automáticamente
    },
    isr: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    igss_patronal: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    igss_laboral: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    prestamos: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    anticipo_salario: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true,
        defaultValue: 0
    },
    total_deducciones: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true // Se calcula automáticamente
    },
    total_bonificaciones: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true // Se calcula automáticamente
    },
    liquido_percibir: {
        type: DataTypes.DECIMAL,
        required: false,
        allowNull: true // Se calcula automáticamente
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (nomina, options) => {
            await calcularTotales(nomina);
        },
        beforeUpdate: async (nomina, options) => {
            await calcularTotales(nomina);
        },
        beforeDestroy: async (nomina, options) => {
            await calcularTotales(nomina);
        },
        afterDestroy: async (nomina, options) => {
            await calcularTotales(nomina);
        },
        afterCreate: async (nomina, options) => {
            await calcularTotales(nomina);
        },
        afterUpdate: async (nomina, options) => {
            await calcularTotales(nomina);
        }
    }
});

async function calcularTotales(nomina) {
    try {
        const bonificaciones = await BonificacionSchema.findAll({
            where: { nominaId: nomina.id }
        });

        const employee = await EmployeeSchema.findByPk(nomina.employeeId, {
            include: [
                // AreaSchema
                { association: 'area' }
            ]
        });

        const salarioBase = parseFloat(employee.area.salary || 0);

        const totalBonificaciones = bonificaciones.reduce((acc, bonificacion) => acc + parseFloat(bonificacion.cantidad || 0), 0);

        // Calcula el total de percepciones
        const totalPercepciones =
            salarioBase +
            // parseFloat(nomina.cantidad_horas_extra || 0) +
            parseFloat(nomina.sueldo_horas_extra || 0) +
            parseFloat(nomina.vacaciones_pagadas || 0) +
            totalBonificaciones;

        // Calcula el total de deducciones
        const totalDeducciones =
            parseFloat(nomina.isr || 0) +
            parseFloat(nomina.igss_patronal || 0) +
            parseFloat(nomina.igss_laboral || 0) +
            parseFloat(nomina.prestamos || 0) +
            parseFloat(nomina.anticipo_salario || 0);

        // Calcula el líquido a percibir
        const liquidoPercibir = totalPercepciones - totalDeducciones;

        // Asigna los valores calculados a la instancia de nómina
        nomina.total_percepciones = totalPercepciones;
        nomina.total_deducciones = totalDeducciones;
        nomina.liquido_percibir = liquidoPercibir;
        nomina.total_bonificaciones = totalBonificaciones;
    } catch (error) {
        console.error("Error al calcular totales", error);
    }
}


NominaSchema.belongsTo(CompanySchema, {
    foreignKey: "companyId",
    targetId: "id"
})

CompanySchema.hasMany(NominaSchema, {
    foreignKey: "companyId",
    sourceKey: "id"
})

NominaSchema.belongsTo(EmployeeSchema, {
    foreignKey: "employeeId",
    targetId: "id"
})

EmployeeSchema.hasMany(NominaSchema, {
    foreignKey: "employeeId",
    sourceKey: "id"
})

NominaSchema.belongsTo(PeriodoSchema, {
    foreignKey: "periodoId",
    targetId: "id"
})

PeriodoSchema.hasMany(NominaSchema, {
    foreignKey: "periodoId",
    sourceKey: "id"
})

NominaSchema.hasMany(BonificacionSchema, {
    foreignKey: "nominaId",
    targetId: "id"
})

BonificacionSchema.belongsTo(NominaSchema, {
    foreignKey: "nominaId",
    sourceKey: "id"
})