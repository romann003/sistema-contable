import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

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