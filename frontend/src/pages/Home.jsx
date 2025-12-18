import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Health Prediction System
      </h1>

      <p className="text-gray-700 max-w-lg text-center mb-6">
        Submit your health symptoms, track your past reports, and get predictions with AI.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
