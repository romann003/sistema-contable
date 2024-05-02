import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { DepartmentSchema } from "./Department.js";

export const AreaSchema = sequelize.define("area", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        required: false,
        allowNull: true,
    },
    salary: {
        type: DataTypes.DECIMAL,
        required: true,
        allowNull: false,
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

DepartmentSchema.hasMany(AreaSchema, {
    foreignKey: "departmentId",
    targetId: "id"
})

AreaSchema.belongsTo(DepartmentSchema, {
    foreignKey: "departmentId",
    sourceKey: "id"
})