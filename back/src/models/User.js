import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { RolSchema } from "./Rol.js";
import bcrypt from 'bcryptjs';

export const UserSchema = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
            isEmail: true
        }
    },
    password: {
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

UserSchema.belongsTo(RolSchema, {
    foreignKey: "rolId",
    targetId: "id"
})

RolSchema.hasMany(UserSchema, {
    foreignKey: "rolId",
    sourceKey: "id"
})

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}