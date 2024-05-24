import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

import { DepartmentSchema } from "./Department.js";
import { AreaSchema } from "./Area.js";

export const EmployeeSchema = sequelize.define("employee", {
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
    phone: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    identification_type: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
    identification: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false
    },
    nit: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
    },
    igss: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false,
        unique: true
    },
    gender: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
    hire_date: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false
    },
    contract_type: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
    work_day: {
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
    timestamps: true,
    getterMethods: {
        fullName() {
            return `${this.name} ${this.last_name}`;
        }
    }
});

EmployeeSchema.belongsTo(DepartmentSchema, {
    foreignKey: "departmentId",
    targetId: "id"
})

DepartmentSchema.hasMany(EmployeeSchema, {
    foreignKey: "departmentId",
    sourceKey: "id"
})

EmployeeSchema.belongsTo(AreaSchema, {
    foreignKey: "areaId",
    targetId: "id"
})

AreaSchema.hasMany(EmployeeSchema, {
    foreignKey: "areaId",
    sourceKey: "id"
})