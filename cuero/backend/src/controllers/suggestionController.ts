import { Request, Response } from 'express';
import Suggestion from '../models/Suggestion';

// CREATE: Enviar una nueva sugerencia al buzón
export const createSuggestion = async (req: Request, res: Response) => {
    try {
        const { clientName, email, message } = req.body;
        
        // Validación básica manual interna
        if (!clientName || !email || !message) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const newSuggestion = new Suggestion({ clientName, email, message });
        await newSuggestion.save();

        res.status(201).json({ message: 'Sugerencia recibida correctamente. Gracias por tu feedback.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al registrar la sugerencia.', error: error.message });
    }
};

// READ: Listar sugerencias (Panel de Administración)
export const getSuggestions = async (_req: Request, res: Response) => {
    try {
        const suggestions = await Suggestion.find().sort({ createdAt: -1 });
        res.json(suggestions);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener el listado de sugerencias.', error: error.message });
    }
};

// UPDATE: Marcar sugerencia como leída
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await Suggestion.findByIdAndUpdate(id, { status: 'read' }, { new: true });
        
        if (!updated) {
            return res.status(404).json({ message: 'Sugerencia no encontrada.' });
        }
        res.json({ message: 'Sugerencia marcada como leída.', updated });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar el estado.', error: error.message });
    }
};