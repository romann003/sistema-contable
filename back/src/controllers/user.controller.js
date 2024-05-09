import { UserSchema, encryptPassword } from "../models/User.js";

export const createUser = async (req, res) => {
    try {
        const { name, last_name, username, email, password, status, rolId, companyId } = req.body;

        // const newUser = await UserSchema.create({
        const newUser = new UserSchema({
            name,
            last_name,
            username,
            email,
            password: await encryptPassword(password),
            status
        });

        if (rolId) {
            newUser.rolId = rolId;
        } else {
            newUser.rolId = 2;
        }

        if (companyId) {
            newUser.companyId = companyId;
        } else {
            newUser.companyId = 1;
        }

        const savedUser = await newUser.save();
        res.status(200).json({ savedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await UserSchema.findAll( { attributes: { exclude: ['password'] }, include: [{ association: 'rol' }] } );
        if (users.length === 0) return res.status(404).json({ message: "No hay usuarios registrados" });
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const getUser = await UserSchema.findOne({ where: { id: req.params.userId } });//, attributes: { exclude: ['password'] } 

        if (!getUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(getUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUserById = async (req, res) => {
    try {
        const { name, last_name, username, email, password, status, rolId, companyId } = req.body;
        const updatedUser = await UserSchema.findByPk(req.params.userId);
        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        // updatedUser.name = name;
        // updatedUser.last_name = last_name;
        // updatedUser.username = username;
        // updatedUser.email = email;
        // updatedUser.password = await encryptPassword(password);
        // updatedUser.rolId = rolId;
        // updatedUser.status = status;
        // updatedUser.companyId = companyId;
        // await updatedUser.save();

        updatedUser.set(req.body);
        if (password) updatedUser.password = await encryptPassword(password);
        await updatedUser.save();

        res.status(200).json({ updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const deleteUser = await UserSchema.destroy({ where: { id: req.params.userId } });
        if (!deleteUser) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
