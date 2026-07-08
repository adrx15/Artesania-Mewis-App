import { Router } from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    searchProducts, 
    getMostViewedProducts 
} from '../controllers/productController';

const router = Router();

// 1. Las rutas fijas siempre deben ir primero
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/analytics/most-viewed', getMostViewedProducts);

// 2. Las rutas con parámetros dinámicos (/:id) siempre van al final
router.get('/:id', getProductById);

router.post('/', createProduct);

export default router;