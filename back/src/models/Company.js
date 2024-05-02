import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { UserSchema } from "./User.js";

export const CompanySchema = sequelize.define("company", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    business_name: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false
    },
    nit: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
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

CompanySchema.hasMany(UserSchema, {
    foreignKey: "companyId",
    sourceKey: "id"
})

UserSchema.belongsTo(CompanySchema, {
    foreignKey: "companyId",
    targetId: "id"
})