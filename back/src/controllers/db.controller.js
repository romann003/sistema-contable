import { sequelize } from "../database.js";

// // Función para asignar roles a un usuario en Oracle
// async function asignarRolesUsuario(nombreUsuario, roles) {
//     try {
//       // Asignar roles al usuario
//       for (let rol of roles) {
//         await sequelize.query(GRANT ${rol} TO ${nombreUsuario});
//       }
//       console.log(Roles asignados correctamente al usuario ${nombreUsuario}.);
//     } catch (error) {
//       console.error('Error al asignar roles:', error);
//     }
//   }
  
//   // Llamar a la función con los detalles del usuario y los roles a asignar
//   asignarRolesUsuario('nuevo_usuario', ['ROLE1', 'ROLE2']);

  export const createDbUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const user = await sequelize.query
        (`CREATE USER ${username} IDENTIFIED BY ${password}`);
        // await asignarRolesUsuario(username, roles);
        res.status(200).json({ message: "Usuario creado correctamente" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const showDbUsers = async (req, res) => {
    try {
        const users = await sequelize.query(`SELECT * FROM dba_users`);
        console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}