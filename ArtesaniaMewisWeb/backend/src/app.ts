import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import suggestionRoutes from './routes/suggestionRoutes';
import {connectDB} from './config/db';

dotenv.config();

const app = express();

// ======================
// CORS
// ======================

const allowedOrigins = [
  'http://localhost:5173',
  'https://artesania-mewis-app-hsph.vercel.app'
];

app.use(
  cors({
    origin(origin, callback) {
      // Permite Postman, Render Health Checks, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origen no permitido: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ======================

app.use(helmet());
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Conexión a MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});