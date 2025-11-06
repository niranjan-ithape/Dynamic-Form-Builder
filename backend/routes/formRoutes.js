// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const authMiddleware = require('../auth/authMiddleware');

// All admin form routes - protected
router.post('/admin/forms', authMiddleware, formController.createForm);
router.get('/admin/forms', authMiddleware, formController.listForms);
router.get('/admin/forms/:id', authMiddleware, formController.getFormById);
router.put('/admin/forms/:id', authMiddleware, formController.updateForm);
router.delete('/admin/forms/:id', authMiddleware, formController.deleteForm);

// Field management
router.post('/admin/forms/:id/fields', authMiddleware, formController.addField);
router.put('/admin/forms/:id/fields/:fieldId', authMiddleware, formController.updateField);
router.delete('/admin/forms/:id/fields/:fieldId', authMiddleware, formController.deleteField);

// Reorder fields
router.put('/admin/forms/:id/fields/reorder', authMiddleware, formController.reorderFields);

module.exports = router;
