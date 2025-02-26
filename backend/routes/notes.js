const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { createNoteSchema, updateNoteSchema } = require('../validation/noteValidation');
const validate = require('../middleware/validationMiddleware');

router.route('/').get(protect, getNotes).post(protect, validate(createNoteSchema), createNote);
router.route('/:id').put(protect, validate(updateNoteSchema), updateNote).delete(protect, deleteNote);

module.exports = router; 