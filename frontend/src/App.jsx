import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AuthPage from "./features/auth/Authpage";
import ProfileDetailsPage from "./features/profile/ProfileDetailsPage";
import { useAuth } from "./context/AuthProvider";

function App() {
  const [authUser] = useAuth();
  const isLoggedIn = Boolean(authUser?.employeeData);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="/profileDetails"
          element={isLoggedIn ? <ProfileDetailsPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster
        position="bottom-right"
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: "var(--color-surface)",
            color: "#e5e5ea",
            border: "1px solid var(--color-brand)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            maxWidth: "380px",
            boxShadow: "0 0 18px rgba(255, 90, 31, 0.35)",
          },
          success: {
            iconTheme: { primary: "var(--color-brand)", secondary: "#fff" },
            style: { borderLeft: "4px solid var(--color-brand)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: {
              border: "1px solid #ef4444",
              borderLeft: "4px solid #ef4444",
              boxShadow: "0 0 18px rgba(239, 68, 68, 0.35)",
            },
          },
          loading: {
            iconTheme: { primary: "var(--color-brand)", secondary: "var(--color-surface-3)" },
            style: { borderLeft: "4px solid var(--color-brand)" },
          },
        }}
      />
    </>
  );
}

export default App;
