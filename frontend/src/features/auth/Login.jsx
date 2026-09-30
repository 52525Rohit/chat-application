import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Field, PasswordToggle, SubmitButton } from "./Authfields";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthProvider";
import { setToken, setRefreshToken } from "../../utils/authStorage";

function Login() {
  const [, setAuthUser] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const response = await login(data);
      if (response?.success) {
        const authData = { employeeData: response.user };
        toast.success(response.message || "Login Successfully");
        localStorage.setItem("userData", JSON.stringify(authData));
        setToken(response.token);
        setRefreshToken(response.refreshToken);
        setAuthUser(authData);
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="animation" style={{ "--i": 0 }}>
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <Field
          label="Email address"
          id="login-email"
          name="email"
          icon={Mail}
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={handleOnChange}
          style={{ "--i": 1 }}
          required
        />

        <Field
          label="Password"
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={data.password}
          onChange={handleOnChange}
          style={{ "--i": 2 }}
          required
        >
          <PasswordToggle
            shown={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </Field>

        <SubmitButton
          loading={isSubmitting}
          loadingText="Signing in..."
          style={{ "--i": 3 }}
        >
          Login
        </SubmitButton>

        <p className="auth-switch animation" style={{ "--i": 4 }}>
          Don&apos;t have an account?
          <br />
          <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </>
  );
}

export default Login;
