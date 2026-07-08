import { Router } from 'express';
import { createSuggestion, getSuggestions, markAsRead } from '../controllers/suggestionController';

const router = Router();

router.post('/', createSuggestion);
router.get('/', getSuggestions);
router.patch('/:id/read', markAsRead);

export default router;