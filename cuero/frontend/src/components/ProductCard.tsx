import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        category: string;
        price: number;
        promotions?: { isPromoted: boolean; discountPercentage: number };
    };
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div style={{ border: '1px solid #d7ccc8', borderRadius: '8px', padding: '1rem', margin: '0.5rem', width: '250px', background: '#fafafa', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{product.name}</h3>
            <p style={{ color: '#795548', fontWeight: 'bold' }}>Categoría: {product.category}</p>
            <p style={{ fontSize: '1.2rem', color: '#2e7d32' }}>${product.price.toLocaleString('es-CL')}</p>
            {product.promotions?.isPromoted && (
                <span style={{ background: '#d84315', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {product.promotions.discountPercentage}% OFF
                </span>
            )}
            <div style={{ marginTop: '1rem' }}>
                <Link to={`/product/${product._id}`} style={{ display: 'block', textAlign: 'center', background: '#5d4037', color: '#fff', padding: '0.5rem', borderRadius: '4px', textDecoration: 'none' }}>
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
};