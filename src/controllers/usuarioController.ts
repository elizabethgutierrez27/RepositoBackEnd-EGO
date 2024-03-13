import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils";

class UsuarioController {


  public async list(req: Request, res: Response) {
    try {
        // Obtener la lista de usuarios desde el modelo
        const users = await model.list();
        // Enviar la lista de usuarios como respuesta JSON
        return res.json({ message: "Listado de Usuario", users: users, code: 0 });
    } catch (error: any) {
        // Manejar errores
        return res.status(500).json({ message: error.message });
    }
}

public async add(req: Request, res: Response) {
    try {
        const { email, password, role } = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Todos los campos son requeridos", code: 1 });
        }

        // Verificar si ya existe un usuario con el mismo correo electrónico
        const existingUser = await model.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Ya existe un usuario con este email", code: 1 });
        }

        // Encriptar la contraseña antes de agregar el usuario
        const encryptedPassword = await utils.hashPassword(password);   
        // Agregar el usuario a la base de datos
        await model.add({ email, password: encryptedPassword, role });

        return res.json({ message: "Usuario agregado correctamente", code: 0 });
    } catch (error: any) {
        // Manejar errores
        return res.status(500).json({ message: error.message });
    }
}

public async update(req: Request, res: Response) {
    try {
        const { email, password, role } = req.body;

        // Verificar si algún campo está vacío
        if (validator.isEmpty(email.trim()) || validator.isEmpty(password.trim()) || validator.isEmpty(role.trim())) {
            return res.status(400).json({ message: "Los campos no pueden estar vacíos", code: 1 });
        }

        // Verificar si el usuario existe antes de actualizarlo
        const existingUser = await model.findByEmail(email);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: "El usuario no existe", code: 1 });
        }

        // Encriptar la nueva contraseña antes de actualizar el usuario
        const encryptedPassword = await utils.hashPassword(password);   
        // Actualizar el usuario con los campos proporcionados, incluida la contraseña encriptada
        await model.update({ email, password: encryptedPassword, role });

        return res.json({ message: "Usuario actualizado correctamente", code: 0 });
    } catch (error: any) {
        // Manejar errores
        return res.status(500).json({ message: error.message });
    }
}

public async delete(req: Request, res: Response) {
    try {
        const email = req.body.email;

        // Verificar si el usuario existe antes de eliminarlo
        const existingUser = await model.findByEmail(email);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: "El usuario no existe", code: 1 });
        }

        // Eliminar el usuario de la base de datos
        await model.delete(email);

        return res.json({ message: "Usuario eliminado correctamente", code: 0 });
    } catch (error: any) {
        // Manejar errores
        return res.status(500).json({ message: error.message });
    }
}
}
export const usuarioController = new UsuarioController();