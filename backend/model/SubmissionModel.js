const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
    },
    responses: [
      {
        fieldId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Field',
          required: true,
        },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
