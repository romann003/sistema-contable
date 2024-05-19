import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const dbUserSchema = sequelize.define("dbUser", {

    username: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false,
        primaryKey: true,

    },
}, {
    tableName: "db_users",
    timestamps: false //DESACTIVA LOS CAMPOS POR DEFECTO DE CREATEDAT Y UPDATEDAT
});