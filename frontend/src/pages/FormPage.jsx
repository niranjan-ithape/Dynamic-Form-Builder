    import React, { useEffect, useState } from "react";
    import { useParams } from "react-router-dom";

    import DynamicForm from "../components/DynamicForm";

    const FormPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchForm = async () => {
        try {
            const data = await getFormById(id);
            setForm(data);
        } catch (err) {
            console.error("Error fetching form:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchForm();
    }, [id]);

    const handleSubmit = async (responses) => {
        try {
        const res = await submitForm(id, responses);
        setMessage(res.message || "Form submitted successfully!");
        } catch (err) {
        console.error(err);
        setMessage("Error submitting form!");
        }
    };

    if (loading) return <p>Loading form...</p>;

    return (
        <div className="max-w-2xl mx-auto mt-8">
        {message && <p className="mb-4 text-green-600">{message}</p>}
        {form ? <DynamicForm form={form} onSubmit={handleSubmit} /> : <p>Form not found.</p>}
        </div>
    );
    };

    export default FormPage;
