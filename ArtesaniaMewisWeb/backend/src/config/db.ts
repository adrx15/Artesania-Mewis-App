import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('La variable MONGODB_URI no está definida en el archivo .env');
        }

        // Aquí se fuerza el uso de IPv4 agregando "family: 4" en las opciones para evitar posibles problemas de conexión
        await mongoose.connect(mongoURI, {
            family: 4
        } as any); 

        console.log('Conexión exitosa a MongoDB de forma segura');
    } catch (error: any) {
        console.error('Error crítico en la conexión a la base de datos:', error.message);
        process.exit(1);
    }
};