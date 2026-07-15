import { Schema, model, Document } from 'mongoose';

export interface IPromotion {
    isPromoted: boolean;
    discountPercentage: number;
    validUntil?: Date;
}

export interface IProduct extends Document {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    viewsCount: number;
    promotions: IPromotion;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true }, // Indexado para consultas rápidas por categoría
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    viewsCount: { type: Number, default: 0, index: -1 }, // Indexado para el ranking de analíticas
    promotions: {
        isPromoted: { type: Boolean, default: false },
        discountPercentage: { type: Number, default: 0 },
        validUntil: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

// Índice de texto para habilitar el motor de búsqueda por palabras clave (G.1 y G.14)
ProductSchema.index({ name: 'text', description: 'text' });

export default model<IProduct>('Product', ProductSchema);