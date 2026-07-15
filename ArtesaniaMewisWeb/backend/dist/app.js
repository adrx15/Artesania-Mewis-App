"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const suggestionRoutes_1 = __importDefault(require("./routes/suggestionRoutes"));
// Configuración de variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Conexión estricta a base de datos NoSQL
(0, db_1.connectDB)();
// Middlewares de seguridad globales
app.use((0, helmet_1.default)());
// Configuración explícita de CORS para entorno de desarrollo local
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // El puerto exacto donde corre el frontend en React con Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express_1.default.json());
// Declaración de Endpoints base de la API REST
app.use('/api/products', productRoutes_1.default);
app.use('/api/suggestions', suggestionRoutes_1.default);
// Middleware global para manejo de errores de infraestructura y código
app.use((err, _req, res, _next) => {
    console.error('Manejador de Errores Global:', err.stack);
    res.status(500).json({
        message: 'Ocurrió un error interno en el servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});
// Encendido del servidor
app.listen(PORT, () => {
    console.log(`Servidor de la API corriendo exitosamente en el puerto ${PORT}`);
});
