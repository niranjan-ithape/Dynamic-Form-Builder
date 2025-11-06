// models/formModel.js
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },

  nestedFields: [
    { 
      type: mongoose.Schema.Types.Mixed 
    }
  ]
}, { _id: false });

const FieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true // unique id within the form (slug or uuid)
  },
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true 
  },
  type: {
    type: String,
    enum: ['text', 'textarea', 'number', 'email', 'date', 'checkbox', 'radio', 'select', 'file'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: {
    type: [OptionSchema],
    default: undefined // only for select/radio/checkbox
  },
  validation: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined // { min, max, regex }
  },
  order: {
    type: Number,
    default: 0
  },
  
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  fields: {
    type: [FieldSchema],
    default: []
  },
  version: {
    type: Number,
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

FormSchema.index({ title: 1 });

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
