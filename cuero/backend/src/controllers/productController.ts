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

// READ: Obtener un producto por ID e incrementar analíticas (viewsCount) de forma atómica
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validación rápida para evitar que colapse Mongoose si envían un string común
        if (id.length !== 24) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { viewsCount: 1 } }, // Incremento atómico solicitado por el administrador
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

// READ: Filtrar catálogo por categorías o promociones activas
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        let filter: any = {};
        if (category) filter.category = category;

        const products = await Product.find(filter).sort({ createdAt: -1 });
        
        // SI TU BASE DE DATOS EN ATLAS ESTÁ VACÍA TODAVÍA:
        // Enviamos un producto de prueba controlado para que el frontend levante de inmediato
        if (products.length === 0) {
            return res.json([
                {
                    _id: "660000000000000000000001",
                    name: "Billetera de Cuero Genuino",
                    description: "Fabricada artesanalmente con costuras reforzadas en hilo encerado. Espacio para 6 tarjetas y billetes.",
                    category: "Bolsos",
                    price: 18990,
                    stock: 5,
                    viewsCount: 12,
                    promotions: { isPromoted: true, discountPercentage: 10 }
                },
                {
                    _id: "660000000000000000000002",
                    name: "Cinturón de Suela Tradicional",
                    description: "Hecho a mano en Olmué con hebilla de bronce envejecido. Ideal para alta durabilidad.",
                    category: "Cinturones",
                    price: 24500,
                    stock: 3,
                    viewsCount: 25,
                    promotions: { isPromoted: false, discountPercentage: 0 }
                }
            ]);
        }

        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al recuperar el catálogo.', error: error.message });
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