import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (id) {
            // Llama a la API e incrementa automáticamente el contador viewsCount en el backend (G.15)
            productService.getById(id)
                .then(res => setProduct(res.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!product) return <div style={{ padding: '2rem' }}>Cargando detalles de la pieza de cuero...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', border: '1px solid #d7ccc8', borderRadius: '8px', background: '#fff', marginTop: '2rem' }}>
            <Link to="/" style={{ color: '#795548', textDecoration: 'none', fontWeight: 'bold' }}>← Volver al catálogo</Link>
            <h2 style={{ marginTop: '1rem' }}>{product.name}</h2>
            <p style={{ fontStyle: 'italic', color: '#616161' }}>{product.description}</p>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Unidades físicas disponibles en taller:</strong> {product.stock}</p>
            <h3 style={{ color: '#2e7d32', fontSize: '1.8rem' }}>${product.price.toLocaleString('es-CL')}</h3>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#efebe9', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#4e342e' }}>
                    * Artículo en exhibición física en el taller de Olmué / Paseo Atkinson. Haz tus consultas directo en tienda aportando el nombre de la pieza.
                </p>
            </div>
        </div>
    );
};