const express = require('express');
const router = express.Router();

const {
  createForm,
  listForms,
  getFormById,
  updateForm,
  deleteForm,
  addField,
  updateField,
  deleteField,
  reorderFields
} = require('../controller/formController');

const { authMiddleware } = require('../auth/authMiddleware');

router.post('/admin/forms',authMiddleware, createForm); 
router.get('/admin/forms', authMiddleware, listForms);
router.get('/admin/forms/:id', authMiddleware, getFormById);
router.put('/admin/forms/:id', authMiddleware, updateForm);
router.delete('/admin/forms/:id', authMiddleware, deleteForm);

// Field management
router.post('/admin/forms/:id/fields', authMiddleware, addField);
router.put('/admin/forms/:id/fields/:fieldId', authMiddleware, updateField);
router.delete('/admin/forms/:id/fields/:fieldId', authMiddleware, deleteField);

// Field reorder
router.put('/admin/forms/:id/fields/reorder', authMiddleware, reorderFields);

module.exports = router;
