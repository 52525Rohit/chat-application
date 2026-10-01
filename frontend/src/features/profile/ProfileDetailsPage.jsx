import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import { getProfilePicUrl } from "../../api/axiosClient";
import { updateProfile } from "../../api/userApi";
import useUpdateProfilePic from "../../hooks/useUpdateProfilePic";
import defaultAvatar from "../../../public/user.jpg";

const inputClass =
  "w-full rounded-lg border border-surface-3 bg-base px-3 py-2 outline-none focus:border-brand";

function ProfileDetailsPage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();
  const { preview, uploadProfilePic } = useUpdateProfilePic();
  const [searchParams] = useSearchParams();
  const profile = authUser?.employeeData;
  const toForm = () => ({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    mobile: profile?.mobile || "",
  });
  // null = view mode; ?edit=1 (from the home page button) opens the form directly
  const [form, setForm] = useState(() =>
    searchParams.has("edit") ? toForm() : null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const profilePic =
    preview || getProfilePicUrl(profile?.profilePic) || defaultAvatar;
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ");

  const startEditing = () => setForm(toForm());

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = await updateProfile(form);
      const updatedAuthUser = {
        employeeData: { ...authUser.employeeData, ...data.user },
      };
      localStorage.setItem("userData", JSON.stringify(updatedAuthUser));
      setAuthUser(updatedAuthUser);
      setForm(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-base text-white">
      <div className="m-auto w-full max-w-md px-4 py-10">
        <div className="flex justify-center">
          <div className="avatar avatar-online">
            <div className="w-28 rounded-full ring-2 ring-brand/50 sm:w-32">
              <img src={profilePic} alt="Your profile" />
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => uploadProfilePic(e.target.files[0])}
              />
              Edit
            </label>
          </div>
        </div>

        {form ? (
          <form onSubmit={handleSave} className="mt-8 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm text-gray-400">
                First name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass + " text-white"}
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-gray-400">
                Last name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass + " text-white"}
                  required
                />
              </label>
            </div>
            <label className="block space-y-1 text-sm text-gray-400">
              Mobile no
              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                className={inputClass + " text-white"}
                required
              />
            </label>
            <p className="text-xs text-gray-500">
              Email can&apos;t be changed: {profile?.email}
            </p>

            <div className="flex justify-center gap-3 pt-5">
              <button
                type="button"
                className="btn btn-ghost btn-sm px-6"
                onClick={() => setForm(null)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-6"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-8 space-y-3">
              {[
                { icon: FaUserAlt, label: "Full name", value: fullName },
                { icon: AiOutlineMail, label: "Email", value: profile?.email },
                { icon: IoCall, label: "Mobile no", value: profile?.mobile },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-xl bg-surface p-3"
                >
                  <row.icon className="shrink-0 text-brand" />
                  <span className="shrink-0 text-sm text-gray-400">
                    {row.label}
                  </span>
                  <span className="ml-auto min-w-0 break-all text-right font-medium">
                    {row.value || "N/A"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                className="btn btn-ghost btn-sm px-6"
                onClick={() => navigate("/")}
              >
                Back
              </button>
              <button
                className="btn btn-primary btn-sm px-6"
                onClick={startEditing}
              >
                Edit profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileDetailsPage;
