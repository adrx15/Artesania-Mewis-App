"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suggestionController_1 = require("../controllers/suggestionController");
const router = (0, express_1.Router)();
router.post('/', suggestionController_1.createSuggestion);
router.get('/', suggestionController_1.getSuggestions);
router.patch('/:id/read', suggestionController_1.markAsRead);
exports.default = router;
