import Sequelize from "sequelize";

export const sequelize = new Sequelize('orcl','SISTEMACONTABLE','123',{
    host: 'localhost',
    // host: '25.12.202.186',
    dialect: 'oracle',
    dialectOptions: {
        timezone: 'America/Guatemala'
    }
    // timezone: '-06:00'
});