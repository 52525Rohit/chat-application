import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
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
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/profileDetails"
          element={isLoggedIn ? <ProfileDetailsPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
