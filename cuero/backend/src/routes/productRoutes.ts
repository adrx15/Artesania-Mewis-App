import { Router } from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    getMostViewedProducts
} from '../controllers/productController'; // Ajusta la ruta a tu controlador

const router = Router();

// Rutas de búsqueda y métricas (deben ir arriba para evitar conflictos con /:id)
router.get('/search', searchProducts);
router.get('/analytics/most-viewed', getMostViewedProducts);

// Rutas CRUD estándar
router.post('/', createProduct);          // CREATE
router.get('/', getProducts);             // READ (Todos)
router.get('/:id', getProductById);       // READ (Detalle)
router.put('/:id', updateProduct);        // UPDATE (Reemplazo o actualización)
router.delete('/:id', deleteProduct);     // DELETE

export default router;