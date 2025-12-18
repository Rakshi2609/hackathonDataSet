import { useEffect, useState } from "react";
import { getMyForms } from "../services/formService";
import { Link } from "react-router-dom";

export default function AllForms() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyForms();
        setForms(res.data.data);
      } catch (err) {
        console.log("Error fetching forms:", err);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Health Submissions</h1>

      {forms.length === 0 ? (
        <p className="text-gray-600">No forms submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form._id}
              className="border p-4 rounded shadow hover:bg-gray-50 flex justify-between items-center"
            >
              <Link to={`/form/${form._id}`} className="flex-1">
                <p><b>Problem Area:</b> {form.problemArea}</p>
                <p className="text-sm text-gray-600">
                  {new Date(form.createdAt).toLocaleString()}
                </p>
              </Link>
              <Link
                to={`/chat/form/${form._id}`}
                className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                💬 Chat
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
