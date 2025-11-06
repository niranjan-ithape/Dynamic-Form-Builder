const Form = require('../model/formModel');
const Field = require('../model/FieldModel');
const Submission = require('../model/SubmissionModel');

// 📍 GET /api/forms/:id — get public form details
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('fields');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📍 POST /api/forms/:id/submit — submit user responses
exports.submitForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const form = await Form.findById(id).populate('fields');
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // 🔍 Validate each field
    const errors = [];
    for (const field of form.fields) {
      const response = responses.find(r => String(r.fieldId) === String(field._id));

      // Required check
      if (field.required && (!response || response.value === '')) {
        errors.push(`${field.label} is required`);
        continue;
      }

      // Type-specific validation
      if (response && field.type === 'text') {
        if (field.minLength && response.value.length < field.minLength) {
          errors.push(`${field.label} must be at least ${field.minLength} characters`);
        }
        if (field.maxLength && response.value.length > field.maxLength) {
          errors.push(`${field.label} must be less than ${field.maxLength} characters`);
        }
      }

      // Regex validation
      if (response && field.regex) {
        const regex = new RegExp(field.regex);
        if (!regex.test(response.value)) {
          errors.push(`${field.label} format is invalid`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // ✅ Save submission
    const submission = new Submission({
      formId: id,
      responses,
    });

    await submission.save();

    res.status(201).json({ success: true, message: 'Form submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
