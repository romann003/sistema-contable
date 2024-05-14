import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { CompanySchema } from "./Company.js";
import { EmployeeSchema } from "./Employee.js";

export const NominaSchema = sequelize.define("nomina", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bonificacion: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false,
    },
    horas_extra: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    vacaciones_pagadas: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    aguinaldo: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false,
    },
    total_percepciones: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    isr: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    igss_patronal: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    igss_laboral: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    prestamos: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    total_deducciones: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    liquido_percibir: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false
    },
    periodo_liquidacion_inicio: {
        type: DataTypes.DATEONLY,
        required: true,
        allowNull: false
    },
    periodo_liquidacion_final: {
        type: DataTypes.DATEONLY,
        required: true,
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        required: true,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        required: true,
        allowNull: false,
        defaultValue: true
    }
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