import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav style={{ padding: '1rem', background: '#3e2723', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Taller de Cuero Quinta Región</h1>
            <div>
                <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none', fontWeight: 500 }}>Catálogo</Link>
                <Link to="/sugerencias" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none', fontWeight: 500 }}>Buzón</Link>
                <Link to="/admin" style={{ color: '#ffcc00', fontWeight: 'bold', textDecoration: 'none' }}>Panel Admin</Link>
            </div>
        </nav>
    );
};