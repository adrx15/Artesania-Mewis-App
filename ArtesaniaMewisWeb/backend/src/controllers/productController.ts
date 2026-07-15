import { Request, Response } from 'express';
import Product from '../models/Product';

// CREATE: Crear un nuevo artículo de cuero
export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error: any) {
        res.status(400).json({ message: 'Error al crear el producto.', error: error.message });
    }
};

// READ: Obtener todos los productos (con filtro opcional por categoría)
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        let filter: any = {};
        if (category) filter.category = category;

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al recuperar el catálogo.', error: error.message });
    }
};

// READ: Obtener un producto por ID e incrementar analíticas de forma atómica
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { viewsCount: 1 } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'El producto artesanal no existe.' });
        }
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al procesar la consulta del producto.', error: error.message });
    }
};

// UPDATE: Modificar un artículo de cuero existente (incluyendo subdocumentos)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // 'new: true' devuelve el documento modificado; 'runValidators' aplica el esquema
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'No se encontró el producto para actualizar.' });
        }

        res.json(updatedProduct);
    } catch (error: any) {
        res.status(400).json({ message: 'Error al actualizar el producto.', error: error.message });
    }
};

// DELETE: Eliminar un artículo de cuero de forma física
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'No se encontró el producto para eliminar.' });
        }

        res.json({ message: 'Producto eliminado exitosamente del catálogo.', id });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al intentar eliminar el producto.', error: error.message });
    }
};

// READ: Motor de Búsqueda Indexada (Text Search)
export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda.' });
        }

        const results = await Product.find(
            { $text: { $search: query as string } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        res.json(results);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al ejecutar la búsqueda.', error: error.message });
    }
};

// READ: Dashboard de Analíticas - Top 5 productos más consultados
export const getMostViewedProducts = async (_req: Request, res: Response) => {
    try {
        const mostViewed = await Product.find()
            .sort({ viewsCount: -1 })
            .limit(5);
        res.json(mostViewed);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al recuperar las métricas operacionales.', error: error.message });
    }
};