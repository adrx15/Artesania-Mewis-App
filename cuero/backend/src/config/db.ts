import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('La variable de entorno MONGODB_URI no está definida.');
        }

        await mongoose.connect(mongoURI);
        console.log('Conexión exitosa a MongoDB Atlas de forma segura.');
    } catch (error: any) {
        console.error('Error crítico en la conexión a la base de datos:', error.message);
        process.exit(1); 
    }
};