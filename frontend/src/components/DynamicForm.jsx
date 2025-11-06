import React, { useState } from "react";

const DynamicForm = ({ form, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const responses = Object.entries(formData).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));
    onSubmit(responses);
  };

  if (!form?.fields) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">{form.title}</h2>

      {form.fields
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <div key={field._id} className="flex flex-col">
            <label className="font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              />
            )}

            {field.type === "email" && (
              <input
                type="email"
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              />
            )}

            {field.type === "date" && (
              <input
                type="date"
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              />
            )}

            {field.type === "select" && (
              <select
                onChange={(e) => handleChange(field._id, e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Select...</option>
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "radio" &&
              field.options.map((opt, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field._id}
                    value={opt}
                    onChange={(e) => handleChange(field._id, e.target.value)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
          </div>
        ))}

      {errors.length > 0 && (
        <ul className="text-red-500 text-sm list-disc pl-5">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
