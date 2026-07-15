"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getSuggestions = exports.createSuggestion = void 0;
const Suggestion_1 = __importDefault(require("../models/Suggestion"));
// CREATE: Enviar una nueva sugerencia al buzón
const createSuggestion = async (req, res) => {
    try {
        const { clientName, email, message } = req.body;
        // Validación básica manual interna
        if (!clientName || !email || !message) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
        const newSuggestion = new Suggestion_1.default({ clientName, email, message });
        await newSuggestion.save();
        res.status(201).json({ message: 'Sugerencia recibida correctamente. Gracias por tu feedback.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al registrar la sugerencia.', error: error.message });
    }
};
exports.createSuggestion = createSuggestion;
// READ: Listar sugerencias (Panel de Administración)
const getSuggestions = async (_req, res) => {
    try {
        const suggestions = await Suggestion_1.default.find().sort({ createdAt: -1 });
        res.json(suggestions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el listado de sugerencias.', error: error.message });
    }
};
exports.getSuggestions = getSuggestions;
// UPDATE: Marcar sugerencia como leída
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Suggestion_1.default.findByIdAndUpdate(id, { status: 'read' }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Sugerencia no encontrada.' });
        }
        res.json({ message: 'Sugerencia marcada como leída.', updated });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado.', error: error.message });
    }
};
exports.markAsRead = markAsRead;
