"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)('Product', ProductSchema);
