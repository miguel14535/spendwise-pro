import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Goals from "./pages/Goals.jsx";

import AuthPage from "./components/AuthPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("spendwise_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage setUser={setUser} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute user={user}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute user={user}>
              <Goals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;