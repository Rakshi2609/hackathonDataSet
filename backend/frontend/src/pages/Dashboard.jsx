import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome, {user?.name} 👋
        </h1>

        <p className="text-gray-600 mb-6">
          Manage your health records and predictions easily.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/create-form"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            ➕ Submit New Health Form
          </Link>

          <Link
            to="/forms"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            📄 View My Submissions
          </Link>

          <Link
            to="/chat"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            💬 Chat with Health Assistant
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
