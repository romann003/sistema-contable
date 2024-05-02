import app from "./app.js"
import { sequelize } from './database.js'

async function main() {
    try {
        await sequelize.sync({ force: false });
        app.listen(3000);
        console.log("Servidor en el puerto", 3000);
    } catch (error) {
        console.error("No fue posible conectarse a la base de datos:", error);
    }
}

main();