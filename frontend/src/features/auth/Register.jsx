import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import { register } from "../../api/authApi";
import { Field, PasswordToggle, SubmitButton } from "./Authfields";

function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Create preview URL for the selected image
  const previewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("mobile", data.mobile);
      if (image) formData.append("imageFile", image);

      const response = await register(formData);
      if (response?.success) {
        toast.success(response.message || "Registration successful");
        navigate("/login");
      } else {
        toast.error(response?.message || "Registration failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during registration.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="animation" style={{ "--i": 0 }}>
        Register
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Profile photo */}
        <div className="auth-avatar animation" style={{ "--i": 1 }}>
          <div className="auth-avatar-pic">
            <label htmlFor="profile_pic">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" />
              ) : (
                <Camera size={20} />
              )}
            </label>
            {image && (
              <button
                type="button"
                className="auth-avatar-clear"
                onClick={handleClearUploadPhoto}
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div className="auth-avatar-text">
            <label htmlFor="profile_pic">
              {image ? "Change photo" : "Upload a photo"}
            </label>
            <p>{image ? image.name : "Optional · JPG or PNG"}</p>
          </div>
          <input
            type="file"
            id="profile_pic"
            name="profile_pic"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhoto}
          />
        </div>

        <div className="auth-row">
          <Field
            label="First name"
            id="reg-firstName"
            name="firstName"
            icon={User}
            autoComplete="given-name"
            value={data.firstName}
            onChange={handleOnChange}
            style={{ "--i": 2 }}
            required
          />
          <Field
            label="Last name"
            id="reg-lastName"
            name="lastName"
            icon={User}
            autoComplete="family-name"
            value={data.lastName}
            onChange={handleOnChange}
            style={{ "--i": 3 }}
            required
          />
        </div>

        <Field
          label="Email address"
          id="reg-email"
          name="email"
          icon={Mail}
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={handleOnChange}
          style={{ "--i": 4 }}
          required
        />

        <Field
          label="Mobile number"
          id="reg-mobile"
          name="mobile"
          icon={Phone}
          type="tel"
          autoComplete="tel"
          value={data.mobile}
          onChange={handleOnChange}
          style={{ "--i": 5 }}
          required
        />

        <Field
          label="Password"
          id="reg-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={data.password}
          onChange={handleOnChange}
          style={{ "--i": 6 }}
          required
        >
          <PasswordToggle
            shown={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </Field>

        <SubmitButton
          loading={isSubmitting}
          loadingText="Creating account..."
          style={{ "--i": 7 }}
        >
          Register
        </SubmitButton>

        <p className="auth-switch animation" style={{ "--i": 8 }}>
          Already have an account?
          <br />
          <Link to="/login">Sign In</Link>
        </p>
      </form>
    </>
  );
}

export default Register;
