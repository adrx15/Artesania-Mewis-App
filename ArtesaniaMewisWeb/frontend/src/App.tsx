import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Suggestions } from './pages/Suggestions';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#fcf8f2', minHeight: '100vh', margin: 0, padding: 0 }}>
        {/* Barra de navegación global */}
        <Navbar />

        {/* Contenedor de páginas dinámicas */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sugerencias" element={<Suggestions />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}