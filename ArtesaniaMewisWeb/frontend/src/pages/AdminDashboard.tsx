import { useEffect, useState } from 'react';
import { productService, suggestionService } from '../services/api';

export const AdminDashboard = () => {
    const [allProducts, setAllProducts] = useState<any[]>([]); // Lista completa para editar/borrar
    const [mostViewed, setMostViewed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Estado para el control de Edición
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Estado para el formulario de producto (ahora sirve para crear y editar)
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        category: 'Bolsos',
        price: '',
        stock: '',
        isPromoted: false,
        discountPercentage: '0'
    });

    const [formStatus, setFormStatus] = useState({ success: false, message: '' });

    // Carga inicial de datos de administración
    const loadAdminData = async () => {
        try {
            // Cargar métricas de analíticas
            const analyticsRes = await productService.getMostViewed();
            setMostViewed(analyticsRes.data);

            // Cargar sugerencias del buzón
            const suggestionsRes = await suggestionService.getAll();
            setSuggestions(suggestionsRes.data);

            // Cargar todos los productos existentes para el gestor del catálogo
            const productsRes = await productService.getAll();
            setAllProducts(productsRes.data);
        } catch (error) {
            console.error('Error cargando datos del panel de control', error);
        }
    };

    // Marcar sugerencia como leída
    const handleMarkAsRead = async (id: string) => {
        try {
            await suggestionService.markAsRead(id);
            loadAdminData(); // Refresca la lista
        } catch (error) {
            console.error(error);
        }
    };

    // Preparar el formulario con los datos del producto seleccionado para EDITAR
    const handleEditSelect = (product: any) => {
        setIsEditing(true);
        setEditingId(product._id);
        setProductForm({
            name: product.name,
            description: product.description,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            isPromoted: product.promotions?.isPromoted || false,
            discountPercentage: String(product.promotions?.discountPercentage || 0)
        });
        setFormStatus({ success: false, message: '' }); // Limpia mensajes antiguos
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente para ver el formulario cargado
    };

    // Cancelar el modo edición y limpiar el formulario
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setProductForm({
            name: '',
            description: '',
            category: 'Bolsos',
            price: '',
            stock: '',
            isPromoted: false,
            discountPercentage: '0'
        });
    };

    // ELIMINAR un producto de forma física
    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta pieza del catálogo?')) {
            try {
                await productService.delete(id);
                setFormStatus({ success: true, message: 'Producto eliminado exitosamente del catálogo.' });
                loadAdminData(); // Refresca las listas y analíticas
            } catch (error: any) {
                console.error('Error al eliminar el producto:', error);
                setFormStatus({ success: false, message: 'Error al eliminar el producto: ' + (error.response?.data?.message || error.message) });
            }
        }
    };

    // Crear o Actualizar un producto (Operación de escritura y actualización de la Rúbrica)
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: productForm.name,
                description: productForm.description,
                category: productForm.category,
                price: Number(productForm.price),
                stock: Number(productForm.stock),
                promotions: {
                    isPromoted: productForm.isPromoted,
                    discountPercentage: productForm.isPromoted ? Number(productForm.discountPercentage) : 0
                }
            };

            if (isEditing && editingId) {
                // Actualizar producto existente
                await productService.update(editingId, payload);
                setFormStatus({ success: true, message: '¡La pieza de cuero ha sido actualizada con éxito!' });
            } else {
                // Crear un nuevo producto
                await productService.create(payload);
                setFormStatus({ success: true, message: '¡Nueva pieza de cuero registrada exitosamente en el catálogo!' });
            }

            // Limpiar formulario y reiniciar estados
            setIsEditing(false);
            setEditingId(null);
            setProductForm({
                name: '',
                description: '',
                category: 'Bolsos',
                price: '',
                stock: '',
                isPromoted: false,
                discountPercentage: '0'
            });
            loadAdminData(); // Actualizar catálogo y analíticas en pantalla
        } catch (error: any) {
            setFormStatus({ success: false, message: 'Error al procesar la operación: ' + (error.response?.data?.message || error.message) });
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Panel de Control y Analíticas Operativas</h2>
            
            {/* Formulario de Registro / Edición de Producto */}
            <div style={{ background: '#f5efe6', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #d7ccc8' }}>
                <h3 style={{ margin: 0, color: '#4e342e' }}>
                    {isEditing ? '📝 Editar Pieza Seleccionada' : '🔨 Registrar Nueva Pieza en Catálogo'}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#795548', marginBottom: '1.5rem' }}>
                    {isEditing ? 'Modifica los valores del producto de cuero en tiempo real.' : 'Añade una nueva confección hecha a mano en el taller.'}
                </p>
                
                {formStatus.message && (
                    <div style={{ padding: '1rem', marginBottom: '1rem', color: '#fff', background: formStatus.success ? '#2e7d32' : '#c62828', borderRadius: '4px' }}>
                        {formStatus.message}
                    </div>
                )}

                <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <label style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                            Nombre de la pieza:
                            <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} style={{ padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </label>
                        
                        <label style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                            Categoría:
                            <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} style={{ padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="Bolsos">Bolsos</option>
                                <option value="Cinturones">Cinturones</option>
                                <option value="Calzado">Calzado</option>
                            </select>
                        </label>
                    </div>

                    <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                        Descripción detallada (tipo de costura, cuero, remaches):
                        <textarea required rows={3} value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} style={{ padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </label>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <label style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                            Precio ($ CLP):
                            <input type="number" required min="0" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} style={{ padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </label>

                        <label style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                            Unidades en Stock:
                            <input type="number" required min="0" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} style={{ padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </label>
                    </div>

                    <div style={{ background: '#efebe9', padding: '1rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                            <input type="checkbox" checked={productForm.isPromoted} onChange={(e) => setProductForm({...productForm, isPromoted: e.target.checked})} />
                            ¿Activar precio promocional / descuento?
                        </label>

                        {productForm.isPromoted && (
                            <label style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center' }}>
                                Porcentaje de Descuento:
                                <input type="number" min="1" max="99" value={productForm.discountPercentage} onChange={(e) => setProductForm({...productForm, discountPercentage: e.target.value})} style={{ width: '80px', padding: '0.25rem', marginLeft: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} /> %
                            </label>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#2c1d11', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}>
                            {isEditing ? 'Guardar Cambios' : 'Guardar en Catálogo'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancelEdit} style={{ padding: '0.75rem', background: '#757575', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* GESTIÓN FÍSICA DEL CATÁLOGO: LISTA COMPLETA CON OPCIÓN UPDATE / DELETE (CRUCIAL PARA RÚBRICA G.23) */}
            <div style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0e0e0' }}>
                <h3 style={{ margin: 0, color: '#3e2723' }}>📦 Gestor de Catálogo Activo</h3>
                <p style={{ fontSize: '0.9rem', color: '#795548', marginBottom: '1.5rem' }}>Administra de manera rápida el inventario físico, edita información o da de baja productos.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {allProducts.length === 0 ? (
                        <p>No hay artículos registrados en el catálogo.</p>
                    ) : (
                        allProducts.map((prod) => (
                            <div key={prod._id} style={{ border: '1px solid #d7ccc8', borderRadius: '6px', padding: '1rem', background: '#fff' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{prod.name}</h4>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Categoría:</strong> {prod.category}</p>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Stock actual:</strong> {prod.stock} unids.</p>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#2e7d32' }}>${prod.price.toLocaleString('es-CL')}</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditSelect(prod)} style={{ flex: 1, padding: '0.4rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => handleDeleteProduct(prod._id)} style={{ flex: 1, padding: '0.4rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Sección Métricas */}
            <div style={{ background: '#efebe9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0 }}>📈 Top 5 Productos Más Consultados (Planificación Física)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff' }}>
                    <thead>
                        <tr style={{ background: '#d7ccc8' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Producto</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Categoría</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Total Consultas (Clics)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostViewed.map((prod: any) => (
                            <tr key={prod._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '0.5rem' }}>{prod.name}</td>
                                <td style={{ padding: '0.5rem' }}>{prod.category}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: '#b66a50' }}>{prod.viewsCount} clics</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Listado de Feedback Recibido */}
            <div>
                <h3>📥 Buzón de Sugerencias Recibidas</h3>
                {suggestions.length === 0 ? (
                    <p>No hay mensajes en el buzón.</p>
                ) : (
                    suggestions.map((sug: any) => (
                        <div key={sug._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', background: sug.status === 'unread' ? '#fff9c4' : '#f5f5f5' }}>
                            <p><strong>De:</strong> {sug.clientName} ({sug.email})</p>
                            <p><strong>Mensaje:</strong> {sug.message}</p>
                            <p><strong>Estado:</strong> <span style={{ fontWeight: 'bold', color: sug.status === 'unread' ? '#e65100' : '#4caf50' }}>{sug.status === 'unread' ? 'No leído' : 'Leído'}</span></p>
                            {sug.status === 'unread' && (
                                <button onClick={() => handleMarkAsRead(sug._id)} style={{ padding: '0.25rem 0.5rem', background: '#5d4037', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Marcar como leído
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};