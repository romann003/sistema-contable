import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { CompanySchema } from "./Company.js";
import { EmployeeSchema } from "./Employee.js";
import { PeriodoSchema, BonificacionSchema } from "./NominaDatos.js";

export const NominaSchema = sequelize.define("nomina", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    horas_extra: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    // vacaciones_pagadas: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // aguinaldo: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false,
    // },
    // total_percepciones: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // isr: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // igss_patronal: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // igss_laboral: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // prestamos: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // total_deducciones: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // },
    // liquido_percibir: {
    //     type: DataTypes.DECIMAL,
    //     required: true,
    //     allowNull: false
    // }
}, {
    timestamps: true //DESACTIVA LOS CAMPOS POR DEFECTO DE CREATEDAT Y UPDATEDAT
});

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