import { useEffect, useState } from 'react';
import { productService, suggestionService } from '../services/api';

export const AdminDashboard = () => {
    const [mostViewed, setMostViewed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const loadAdminData = async () => {
        try {
            const analyticsRes = await productService.getMostViewed();
            setMostViewed(analyticsRes.data);

            const suggestionsRes = await suggestionService.getAll();
            setSuggestions(suggestionsRes.data);
        } catch (error) {
            console.error('Error cargando métricas del panel de control', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await suggestionService.markAsRead(id);
            loadAdminData(); // Refresca la lista
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Panel de Control y Analíticas Operativas</h2>
            
            {/* Sección Métricas de la Rúbrica (G.15) */}
            <div style={{ background: '#efebe9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h3>📈 Top 5 Productos Más Consultados (Planificación de Producción Física)</h3>
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

            {/* Listado de Feedback Recibido (G.16) */}
            <div>
                <h3>📥 Buzón de Sugerencias Recibidas</h3>
                {suggestions.length === 0 ? <p>No hay mensajes en el buzón.</p> : (
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