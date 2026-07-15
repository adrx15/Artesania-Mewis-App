"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('La variable MONGODB_URI no está definida en el archivo .env');
        }
        // Aquí se fuerza el uso de IPv4 agregando "family: 4" en las opciones para evitar posibles problemas de conexión
        await mongoose_1.default.connect(mongoURI, {
            family: 4
        });
        console.log('Conexión exitosa a MongoDB de forma segura');
    }
    catch (error) {
        console.error('Error crítico en la conexión a la base de datos:', error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
