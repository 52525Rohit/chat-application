import React from "react";
import { useLocation } from "react-router-dom";
import { BsChat } from "react-icons/bs";
import Login from "./Login";
import Register from "./Register";
import "./auth.css";

function AuthPage() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/register");

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="auth-brand-icon">
          <BsChat size={24} />
        </span>
        <h1>
          Chat<span>App</span>
        </h1>
      </div>

      <div className={`auth-container${active ? " active" : ""}`}>
        <div className="auth-shape1" />
        <div className="auth-shape2" />

        <div className="auth-form-box login">
          <Login />
        </div>
        <div className="auth-info login">
          <h2 className="animation" style={{ "--i": 0 }}>
            Welcome back!
          </h2>
          <p className="animation" style={{ "--i": 1 }}>
            Your conversations are waiting. Log in to catch up on new messages
            and keep chatting with your friends.
          </p>
        </div>

        <div className="auth-form-box register">
          <Register />
        </div>
        <div className="auth-info register">
          <h2 className="animation" style={{ "--i": 0 }}>
            Welcome!
          </h2>
          <p className="animation" style={{ "--i": 1 }}>
            Create your account and start chatting in real time. Share messages
            and photos with the people who matter.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
