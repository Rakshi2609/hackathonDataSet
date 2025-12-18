  import { BrowserRouter, Routes, Route } from "react-router-dom";

  // Pages
  import Home from "./pages/Home";
  import Register from "./pages/Register";
  import Login from "./pages/Login";
  import Dashboard from "./pages/Dashboard";
  import CreateForm from "./pages/CreateForm";
  import AllForms from "./pages/AllForms";
  import FormDetails from "./pages/FormDetails";
  import MainChat from "./pages/MainChat";
  import FormChat from "./pages/FormChat";

  // Auth Context + Protected Route
  import AuthProvider from "./context/AuthContext";
  import ProtectedRoute from "./components/ProtectedRoute";

  export default function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-form"
              element={
                <ProtectedRoute>
                  <CreateForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/forms"
              element={
                <ProtectedRoute>
                  <AllForms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/form/:id"
              element={
                <ProtectedRoute>
                  <FormDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <MainChat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/form/:id"
              element={
                <ProtectedRoute>
                  <FormChat />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }
