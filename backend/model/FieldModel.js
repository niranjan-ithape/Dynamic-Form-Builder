const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'text',
        'number',
        'email',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'date',
        'file',
      ],
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        type: String,
      },
    ], // for select, radio, checkbox
    order: {
      type: Number,
      default: 0,
    },
    minLength: {
      type: Number,
    },
    maxLength: {
      type: Number,
    },
    regex: {
      type: String, // store as string, convert to RegExp in controller
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Field', fieldSchema);
