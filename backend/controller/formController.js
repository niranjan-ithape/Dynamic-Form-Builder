// controllers/formController.js
const Form = require('../models/formModel');
const { v4: uuidv4 } = require('uuid');

/**
 * Standard response helper
 */
const sendSuccess = (res, message, data = null, status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const sendError = (res, message, status = 400, data = null) => {
  return res.status(status).json({ success: false, message, data });
};

/**
 * Create a new form
 * Body: { title, description }
 */
async function createForm(req, res) {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
      return sendError(res, 'Title is required', 400);
    }

    const form = new Form({
      title: title.trim(),
      description: description ? description.trim() : '',
      fields: [],
      version: 1
    });

    await form.save();
    return sendSuccess(res, 'Form created successfully', form, 201);
  } catch (err) {
    console.error('createForm error', err);
    return sendError(res, 'Unable to create form', 500);
  }
}

/**
 * List all forms (exclude soft deleted)
 */
async function listForms(req, res) {
  try {
    const forms = await Form.find({ isDeleted: false })
      .select('title description version createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    return sendSuccess(res, 'Forms fetched', forms);
  } catch (err) {
    console.error('listForms error', err);
    return sendError(res, 'Unable to fetch forms', 500);
  }
}

/**
 * Get a single form by id (with fields)
 */
async function getFormById(req, res) {
  try {
    const { id } = req.params;
    const form = await Form.findOne({ _id: id, isDeleted: false }).lean();
    if (!form) return sendError(res, 'Form not found', 404);
    return sendSuccess(res, 'Form fetched', form);
  } catch (err) {
    console.error('getFormById error', err);
    return sendError(res, 'Unable to fetch form', 500);
  }
}

/**
 * Update form metadata (title/description)
 * Body: { title?, description? }
 */
async function updateForm(req, res) {
  try {
    const { id } = req.params;
    const update = {};
    const { title, description } = req.body;
    if (title !== undefined) {
      if (!title || String(title).trim() === '') {
        return sendError(res, 'Title cannot be empty', 400);
      }
      update.title = String(title).trim();
    }
    if (description !== undefined) update.description = String(description).trim();

    update.updatedAt = new Date();

    const updated = await Form.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: update },
      { new: true }
    );
    if (!updated) return sendError(res, 'Form not found', 404);
    return sendSuccess(res, 'Form updated', updated);
  } catch (err) {
    console.error('updateForm error', err);
    return sendError(res, 'Unable to update form', 500);
  }
}

/**
 * Soft-delete a form
 */
async function deleteForm(req, res) {
  try {
    const { id } = req.params;
    const updated = await Form.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedAt: new Date() } },
      { new: true }
    );
    if (!updated) return sendError(res, 'Form not found', 404);
    return sendSuccess(res, 'Form deleted', null);
  } catch (err) {
    console.error('deleteForm error', err);
    return sendError(res, 'Unable to delete form', 500);
  }
}

/**
 * Add a field to a form
 * Body: field object without id (we'll generate id)
 */
async function addField(req, res) {
  try {
    const { id } = req.params; // form id
    const payload = req.body;
    // Validate minimal field properties
    const { label, name, type } = payload;
    if (!label || !name || !type) {
      return sendError(res, 'Field label, name and type are required', 400);
    }

    const form = await Form.findOne({ _id: id, isDeleted: false });
    if (!form) return sendError(res, 'Form not found', 404);

    // ensure name uniqueness within form
    if (form.fields.some(f => f.name === name)) {
      return sendError(res, 'Field name must be unique within the form', 400);
    }

    const field = {
      id: uuidv4(),
      label: String(label).trim(),
      name: String(name).trim(),
      type: String(type),
      required: !!payload.required,
      options: payload.options || undefined,
      validation: payload.validation || undefined,
      order: typeof payload.order === 'number' ? payload.order : (form.fields.length + 1)
    };

    form.fields.push(field);
    // keep fields sorted by order
    form.fields = form.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
    form.version = (form.version || 1) + 1; // bump version for structural change
    await form.save();
    return sendSuccess(res, 'Field added', field, 201);
  } catch (err) {
    console.error('addField error', err);
    return sendError(res, 'Unable to add field', 500);
  }
}

/**
 * Update a field inside a form
 * Body: new field properties
 */
async function updateField(req, res) {
  try {
    const { id, fieldId } = req.params; // id => form id
    const payload = req.body;
    const form = await Form.findOne({ _id: id, isDeleted: false });
    if (!form) return sendError(res, 'Form not found', 404);

    const idx = form.fields.findIndex(f => f.id === fieldId);
    if (idx === -1) return sendError(res, 'Field not found', 404);

    // If name changes, ensure uniqueness
    if (payload.name && payload.name !== form.fields[idx].name) {
      if (form.fields.some((f, i) => f.name === payload.name && i !== idx)) {
        return sendError(res, 'Field name must be unique within the form', 400);
      }
    }

    // Update allowed keys
    const allowed = ['label', 'name', 'type', 'required', 'options', 'validation', 'order'];
    allowed.forEach(k => {
      if (payload[k] !== undefined) form.fields[idx][k] = payload[k];
    });

    // sort if order changed
    form.fields = form.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
    form.version = (form.version || 1) + 1; // bump version on structural change
    await form.save();
    return sendSuccess(res, 'Field updated', form.fields[idx]);
  } catch (err) {
    console.error('updateField error', err);
    return sendError(res, 'Unable to update field', 500);
  }
}

/**
 * Delete a field inside a form
 */
async function deleteField(req, res) {
  try {
    const { id, fieldId } = req.params;
    const form = await Form.findOne({ _id: id, isDeleted: false });
    if (!form) return sendError(res, 'Form not found', 404);

    const newFields = form.fields.filter(f => f.id !== fieldId);
    if (newFields.length === form.fields.length) return sendError(res, 'Field not found', 404);

    form.fields = newFields;
    form.version = (form.version || 1) + 1;
    await form.save();
    return sendSuccess(res, 'Field deleted', null);
  } catch (err) {
    console.error('deleteField error', err);
    return sendError(res, 'Unable to delete field', 500);
  }
}

/**
 * Reorder fields (accepts array of {id, order})
 * Body: { orders: [{ id: 'fieldId', order: 1 }, ...] }
 */
async function reorderFields(req, res) {
  try {
    const { id } = req.params;
    const { orders } = req.body;
    if (!Array.isArray(orders)) return sendError(res, 'orders array is required', 400);

    const form = await Form.findOne({ _id: id, isDeleted: false });
    if (!form) return sendError(res, 'Form not found', 404);

    const map = {};
    orders.forEach(o => {
      if (o.id && typeof o.order === 'number') map[o.id] = o.order;
    });

    form.fields = form.fields.map(f => {
      if (map[f.id] !== undefined) f.order = map[f.id];
      return f;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));

    form.version = (form.version || 1) + 1;
    await form.save();
    return sendSuccess(res, 'Fields reordered', form.fields);
  } catch (err) {
    console.error('reorderFields error', err);
    return sendError(res, 'Unable to reorder fields', 500);
  }
}

module.exports = {
  createForm,
  listForms,
  getFormById,
  updateForm,
  deleteForm,
  addField,
  updateField,
  deleteField,
  reorderFields
};
