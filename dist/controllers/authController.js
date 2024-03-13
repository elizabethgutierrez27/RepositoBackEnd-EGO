"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const validator_1 = __importDefault(require("validator"));
const authModelo_1 = __importDefault(require("../models/authModelo"));
const utils_1 = require("../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
class AuthController {
    iniciarSesion(req, res) {
        try {
            const { email, password } = req.body;
            // Verificar que los datos no estén vacíos
            if (validator_1.default.isEmpty(email.trim()) || validator_1.default.isEmpty(password.trim())) {
                return res.status(400).json({ message: "Los campos son requeridos", code: 1 });
            }
            authModelo_1.default.getuserByEmail(email)
                .then((ltsUsers) => {
                // Verificar que los campos sean correctos
                if (ltsUsers.length <= 0) {
                    return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
                }
                console.log(ltsUsers[0].username, ltsUsers[0].password);
                utils_1.utils.checkPassword(password, ltsUsers[0].password)
                    .then((value) => {
                    if (value) {
                        const newUser = {
                            email: ltsUsers[0].email,
                            password: ltsUsers[0].password,
                            role: ltsUsers[0].role
                        };
                        const token = jsonwebtoken_1.default.sign(newUser, process.env.SECRET, { expiresIn: '1h' });
                        return res.json({ message: "Autenticación correcta", code: 0, token: token });
                    }
                    else {
                        return res.json({ message: "Password Incorrecto", code: 1 });
                    }
                });
            });
        }
        catch (error) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }
}
exports.authController = new AuthController();
//# sourceMappingURL=authController.js.map