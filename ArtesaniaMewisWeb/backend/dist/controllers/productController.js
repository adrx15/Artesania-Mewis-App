"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostViewedProducts = exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// CREATE: Crear un nuevo artículo de cuero
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product_1.default(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(400).json({ message: 'Error al crear el producto.', error: error.message });
    }
};
exports.createProduct = createProduct;
// READ: Obtener todos los productos (con filtro opcional por categoría)
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        if (category)
            filter.category = category;
        const products = await Product_1.default.find(filter).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al recuperar el catálogo.', error: error.message });
    }
};
exports.getProducts = getProducts;
// READ: Obtener un producto por ID e incrementar analíticas de forma atómica
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const product = await Product_1.default.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'El producto artesanal no existe.' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al procesar la consulta del producto.', error: error.message });
    }
};
exports.getProductById = getProductById;
// UPDATE: Modificar un artículo de cuero existente (incluyendo subdocumentos)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true } // 'new: true' devuelve el documento modificado; 'runValidators' aplica el esquema
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'No se encontró el producto para actualizar.' });
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto.', error: error.message });
    }
};
exports.updateProduct = updateProduct;
// DELETE: Eliminar un artículo de cuero de forma física
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const deletedProduct = await Product_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'No se encontró el producto para eliminar.' });
        }
        res.json({ message: 'Producto eliminado exitosamente del catálogo.', id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al intentar eliminar el producto.', error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
// READ: Motor de Búsqueda Indexada (Text Search)
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda.' });
        }
        const results = await Product_1.default.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al ejecutar la búsqueda.', error: error.message });
    }
};
exports.searchProducts = searchProducts;
// READ: Dashboard de Analíticas - Top 5 productos más consultados
const getMostViewedProducts = async (_req, res) => {
    try {
        const mostViewed = await Product_1.default.find()
            .sort({ viewsCount: -1 })
            .limit(5);
        res.json(mostViewed);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al recuperar las métricas operacionales.', error: error.message });
    }
};
exports.getMostViewedProducts = getMostViewedProducts;
