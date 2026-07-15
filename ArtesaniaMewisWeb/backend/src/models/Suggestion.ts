import { Schema, model, Document } from 'mongoose';

export interface ISuggestion extends Document {
    clientName: string;
    email: string;
    message: string;
    status: 'unread' | 'read';
    createdAt: Date;
}

const SuggestionSchema = new Schema<ISuggestion>({
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});

export default model<ISuggestion>('Suggestion', SuggestionSchema);