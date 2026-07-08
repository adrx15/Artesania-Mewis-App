import { useState } from 'react';
import { suggestionService } from '../services/api';

export const Suggestions = () => {
    const [form, setForm] = useState({ clientName: '', email: '', message: '' });
    const [status, setStatus] = useState({ success: false, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await suggestionService.create(form);
            setStatus({ success: true, message: response.data.message });
            setForm({ clientName: '', email: '', message: '' });
        } catch (error: any) {
            setStatus({ success: false, message: 'Ocurrió un error al enviar el formulario.' });
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            <h2>Buzón de Sugerencias para el Artesano</h2>
            <p>Déjanos tus ideas, solicitudes de diseños a pedido o comentarios para mejorar.</p>
            
            {status.message && (
                <div style={{ padding: '1rem', marginBottom: '1rem', color: '#fff', background: status.success ? '#2e7d32' : '#c62828', borderRadius: '4px' }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                    Nombre completo:
                    <input type="text" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </label>
                <label>
                    Correo Electrónico:
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </label>
                <label>
                    Mensaje / Sugerencia:
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </label>
                <button type="submit" style={{ padding: '0.75rem', background: '#5d4037', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Enviar Comentarios
                </button>
            </form>
        </div>
    );
};