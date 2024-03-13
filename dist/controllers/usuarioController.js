"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const validator_1 = __importDefault(require("validator"));
const usuarioModelo_1 = __importDefault(require("../models/usuarioModelo"));
const utils_1 = require("../utils/utils");
class UsuarioController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener la lista de usuarios desde el modelo
                const users = yield usuarioModelo_1.default.list();
                // Enviar la lista de usuarios como respuesta JSON
                return res.json({ message: "Listado de Usuario", users: users, code: 0 });
            }
            catch (error) {
                // Manejar errores
                return res.status(500).json({ message: error.message });
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role } = req.body;
                // Verificar si todos los campos necesarios están presentes
                if (!email || !password || !role) {
                    return res.status(400).json({ message: "Todos los campos son requeridos", code: 1 });
                }
                // Verificar si ya existe un usuario con el mismo correo electrónico
                const existingUser = yield usuarioModelo_1.default.findByEmail(email);
                if (existingUser.length > 0) {
                    return res.status(400).json({ message: "Ya existe un usuario con este email", code: 1 });
                }
                // Encriptar la contraseña antes de agregar el usuario
                const encryptedPassword = yield utils_1.utils.hashPassword(password);
                // Agregar el usuario a la base de datos
                yield usuarioModelo_1.default.add({ email, password: encryptedPassword, role });
                return res.json({ message: "Usuario agregado correctamente", code: 0 });
            }
            catch (error) {
                // Manejar errores
                return res.status(500).json({ message: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role } = req.body;
                // Verificar si algún campo está vacío
                if (validator_1.default.isEmpty(email.trim()) || validator_1.default.isEmpty(password.trim()) || validator_1.default.isEmpty(role.trim())) {
                    return res.status(400).json({ message: "Los campos no pueden estar vacíos", code: 1 });
                }
                // Verificar si el usuario existe antes de actualizarlo
                const existingUser = yield usuarioModelo_1.default.findByEmail(email);
                if (existingUser.length === 0) {
                    return res.status(404).json({ message: "El usuario no existe", code: 1 });
                }
                // Encriptar la nueva contraseña antes de actualizar el usuario
                const encryptedPassword = yield utils_1.utils.hashPassword(password);
                // Actualizar el usuario con los campos proporcionados, incluida la contraseña encriptada
                yield usuarioModelo_1.default.update({ email, password: encryptedPassword, role });
                return res.json({ message: "Usuario actualizado correctamente", code: 0 });
            }
            catch (error) {
                // Manejar errores
                return res.status(500).json({ message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                // Verificar si el usuario existe antes de eliminarlo
                const existingUser = yield usuarioModelo_1.default.findByEmail(email);
                if (existingUser.length === 0) {
                    return res.status(404).json({ message: "El usuario no existe", code: 1 });
                }
                // Eliminar el usuario de la base de datos
                yield usuarioModelo_1.default.delete(email);
                return res.json({ message: "Usuario eliminado correctamente", code: 0 });
            }
            catch (error) {
                // Manejar errores
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
//# sourceMappingURL=usuarioController.js.map