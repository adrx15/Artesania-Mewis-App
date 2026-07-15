"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController"); // Ajusta la ruta a tu controlador
const router = (0, express_1.Router)();
// Rutas de búsqueda y métricas (deben ir arriba para evitar conflictos con /:id)
router.get('/search', productController_1.searchProducts);
router.get('/analytics/most-viewed', productController_1.getMostViewedProducts);
// Rutas CRUD estándar
router.post('/', productController_1.createProduct); // CREATE
router.get('/', productController_1.getProducts); // READ (Todos)
router.get('/:id', productController_1.getProductById); // READ (Detalle)
router.put('/:id', productController_1.updateProduct); // UPDATE (Reemplazo o actualización)
router.delete('/:id', productController_1.deleteProduct); // DELETE
exports.default = router;
