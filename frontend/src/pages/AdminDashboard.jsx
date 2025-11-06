
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const token = userData?.token;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("forms");

  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "" });

 
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newField, setNewField] = useState({ label: "", name: "", type: "text", required: false, options: "" });


  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const fetchForms = async () => {
    try {
      setLoadingForms(true);
      const res = await API.get("/forms", getAuthHeaders());
      setForms(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch forms");
      setForms([]);
    } finally {
      setLoadingForms(false);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/forms", newForm, getAuthHeaders());
      toast.success("Form created successfully!");
      setNewForm({ title: "", description: "" });
      setShowFormModal(false);
      fetchForms();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create form");
    }
  };

  const handleUpdateForm = async (id, updatedData) => {
    try {
      await API.put(`/forms/${id}`, updatedData, getAuthHeaders());
      toast.success("Form updated");
      fetchForms();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update form");
    }
  };

  const handleDeleteForm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      await API.delete(`/forms/${id}`, getAuthHeaders());
      toast.success("Form deleted");
      fetchForms();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete form");
    }
  };

  // --------------------
  // Fields API
  // --------------------
  const fetchFields = async (formId) => {
    try {
      setLoadingFields(true);
      const res = await API.get(`/forms/${formId}`, getAuthHeaders());
      setFields(res.data.data.fields || []);
      setCurrentFormId(formId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch fields");
      setFields([]);
    } finally {
      setLoadingFields(false);
    }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newField,
        options: newField.options ? newField.options.split(",").map(o => o.trim()) : [],
      };
      await API.post(`/forms/${currentFormId}/fields`, payload, getAuthHeaders());
      toast.success("Field added");
      setNewField({ label: "", name: "", type: "text", required: false, options: "" });
      setShowFieldModal(false);
      fetchFields(currentFormId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add field");
    }
  };

  const handleUpdateField = async (fieldId, updatedData) => {
    try {
      await API.put(`/forms/${currentFormId}/fields/${fieldId}`, updatedData, getAuthHeaders());
      toast.success("Field updated");
      fetchFields(currentFormId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update field");
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    try {
      await API.delete(`/forms/${currentFormId}/fields/${fieldId}`, getAuthHeaders());
      toast.success("Field deleted");
      fetchFields(currentFormId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete field");
    }
  };

  
  const fetchSubmissions = async (formId) => {
    try {
      setLoadingSubs(true);
      const res = await axios.get(`http://localhost:5000/api/forms/${formId}`);
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch submissions");
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  };


  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-gray-800 text-white flex flex-col"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold p-6">Admin Panel</h1>
        <nav className="flex flex-col mt-4 space-y-2">
          <button
            className={`p-4 text-left hover:bg-gray-700 ${activeTab === "forms" && "bg-gray-700"}`}
            onClick={() => setActiveTab("forms")}
          >
            Forms Management
          </button>
          <button
            className={`p-4 text-left hover:bg-gray-700 ${activeTab === "fields" && "bg-gray-700"}`}
            onClick={() => setActiveTab("fields")}
          >
            Fields Management
          </button>
          <button
            className={`p-4 text-left hover:bg-gray-700 ${activeTab === "submissions" && "bg-gray-700"}`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </nav>
      </motion.div>

      
      <div className="flex-1 p-8 overflow-auto">
        <AnimatePresence mode="wait">
          
          {activeTab === "forms" && (
            <motion.div
              key="forms"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Forms Management</h2>
             
                <button
                  onClick={() => setShowFormModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  + Create Form
                </button>
              </div>

              {loadingForms ? (
                <p>Loading forms...</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forms.map((form) => (
                    <div
                      key={form._id}
                      className="bg-white p-4 rounded shadow border border-gray-200"
                    >
                      <h3 className="font-semibold">{form.title}</h3>
                      <p className="text-gray-500 text-sm">{form.description}</p>
                      <div className="flex justify-end mt-3 space-x-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            fetchFields(form._id);
                            setActiveTab("fields");
                          }}
                        >
                          Manage Fields
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteForm(form._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          
          {activeTab === "fields" && (
            <motion.div
              key="fields"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Fields Management</h2>
                {/* ADD FIELD BUTTON – only when a form is selected */}
                {currentFormId && (
                  <button
                    onClick={() => setShowFieldModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    + Add Field
                  </button>
                )}
              </div>

              {loadingFields ? (
                <p>Loading fields...</p>
              ) : fields.length === 0 ? (
                <p className="text-gray-600">
                  {currentFormId
                    ? "No fields yet. Click “+ Add Field” to get started."
                    : "Select a form first."}
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="bg-white p-4 rounded shadow border border-gray-200"
                    >
                      <h3 className="font-semibold">{field.label}</h3>
                      <p className="text-gray-500 text-sm">Type: {field.type}</p>
                      <p className="text-gray-500 text-sm">
                        Required: {field.required ? "Yes" : "No"}
                      </p>
                      {field.options && (
                        <p className="text-gray-500 text-sm">
                          Options: {field.options.join(", ")}
                        </p>
                      )}
                      <div className="flex justify-end mt-3 space-x-3">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        
          {activeTab === "submissions" && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">Submissions</h2>
              {loadingSubs ? (
                <p>Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-gray-600">No submissions yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub._id}
                      className="bg-white p-4 rounded shadow border border-gray-200"
                    >
                      <h3 className="font-semibold">
                        {sub.formId?.title || "Form"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Submitted: {sub.submittedAt}
                      </p>
                      <div className="mt-2 text-gray-700 text-sm">
                        {sub.responses?.map((r) => (
                          <p key={r.fieldId}>
                            <strong>{r.label}:</strong> {r.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

   
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFormModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Create New Form</h3>
              <form onSubmit={handleCreateForm}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newForm.title}
                    onChange={(e) =>
                      setNewForm({ ...newForm, title: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newForm.description}
                    onChange={(e) =>
                      setNewForm({ ...newForm, description: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {showFieldModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFieldModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Add New Field</h3>
              <form onSubmit={handleAddField}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name (key)</label>
                  <input
                    type="text"
                    required
                    value={newField.name}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Options (comma-separated, for select/radio/checkbox)
                  </label>
                  <input
                    type="text"
                    value={newField.options}
                    onChange={(e) =>
                      setNewField({ ...newField, options: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. Option A, Option B"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="required" className="text-sm">
                    Required
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowFieldModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Field
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;