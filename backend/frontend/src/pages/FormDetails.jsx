
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFormById } from "../services/formService";

export default function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await getFormById(id);
        setForm(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching form");
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!form) return <div>No form found.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Form Details</h2>
        <Link
          to={`/chat/form/${id}`}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          💬 Chat About This Form
        </Link>
      </div>
      <div className="space-y-2">
        <div><strong>Heart Rate:</strong> {form.heartRate}</div>
        <div><strong>SpO2:</strong> {form.spo2}</div>
        <div><strong>Temperature:</strong> {form.temperature}</div>
        <div><strong>Blood Pressure:</strong> {form.bloodPressure?.systolic} / {form.bloodPressure?.diastolic}</div>
        <div><strong>Problem Area:</strong> {form.problemArea}</div>
        {/* Add more fields as needed */}
        <div><strong>Created At:</strong> {new Date(form.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
