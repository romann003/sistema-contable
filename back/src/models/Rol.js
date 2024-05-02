import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const RolSchema = sequelize.define("rol", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
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