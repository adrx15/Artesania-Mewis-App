import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import productRoutes from './routes/productRoutes';
import suggestionRoutes from './routes/suggestionRoutes';

// Configuración de variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Conexión estricta a base de datos NoSQL
connectDB();

// Middlewares de seguridad globales
app.use(helmet());

// Configuración explícita de CORS para entorno de desarrollo local
app.use(cors({
    origin: 'http://localhost:5173', // El puerto exacto donde corre el frontend en React con Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());

// Declaración de Endpoints base de la API REST
app.use('/api/products', productRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Middleware global para manejo de errores de infraestructura y código
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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