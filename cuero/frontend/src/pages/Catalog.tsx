import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await productService.getAll(category || undefined);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al cargar catálogo', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchProducts();
            return;
        }
        try {
            const response = await productService.search(searchQuery);
            setProducts(response.data);
        } catch (error) {
            console.error('Error en la búsqueda', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Catálogo de Artículos de Cuero</h2>
            
            {/* Buscador e Índices de Texto (G.1 y G.14) */}
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                <input 
                    type="text" 
                    placeholder="Buscar billeteras, cinturones, bolsos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.5rem', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#5d4037', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Buscar</button>
            </form>

            {/* Filtros por Categoría */}
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => setCategory('')} style={{ marginRight: '0.5rem', padding: '0.5rem', background: category === '' ? '#8d6e63' : '#e0e0e0', color: category === '' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Todos</button>
                <button onClick={() => setCategory('Bolsos')} style={{ marginRight: '0.5rem', padding: '0.5rem', background: category === 'Bolsos' ? '#8d6e63' : '#e0e0e0', color: category === 'Bolsos' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Bolsos</button>
                <button onClick={() => setCategory('Cinturones')} style={{ marginRight: '0.5rem', padding: '0.5rem', background: category === 'Cinturones' ? '#8d6e63' : '#e0e0e0', color: category === 'Cinturones' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Cinturones</button>
                <button onClick={() => setCategory('Calzado')} style={{ padding: '0.5rem', background: category === 'Calzado' ? '#8d6e63' : '#e0e0e0', color: category === 'Calzado' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Calzado</button>
            </div>

            {/* Grilla de productos */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.length > 0 ? (
                    products.map((product: any) => <ProductCard key={product._id} product={product} />)
                ) : (
                    <p>No se encontraron productos en esta sección.</p>
                )}
            </div>
        </div>
    );
};