import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { CompanySchema } from "./Company.js";

export const DepartmentSchema = sequelize.define("department", {
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
    status: {
        type: DataTypes.BOOLEAN,
        required: true,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: true //DESACTIVA LOS CAMPOS POR DEFECTO DE CREATEDAT Y UPDATEDAT
});

DepartmentSchema.belongsTo(CompanySchema, {
    foreignKey: "companyId",
    sourceKey: "id"
})

CompanySchema.hasMany(DepartmentSchema, {
    foreignKey: "companyId",
    targetId: "id"
})