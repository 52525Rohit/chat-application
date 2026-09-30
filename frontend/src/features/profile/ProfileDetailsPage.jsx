import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getProfilePicUrl } from "../../api/axiosClient";
import useUpdateProfilePic from "../../hooks/useUpdateProfilePic";
import defaultAvatar from "../../../public/user.jpg";

function ProfileDetailsPage() {
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const { preview, uploadProfilePic } = useUpdateProfilePic();

  const profile = authUser?.employeeData;
  const profilePic =
    preview || getProfilePicUrl(profile?.profilePic) || defaultAvatar;

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

        <div className="mt-8 space-y-3">
          {[
            { icon: FaUserAlt, label: "Full name", value: profile?.firstName },
            { icon: AiOutlineMail, label: "Email", value: profile?.email },
            { icon: IoCall, label: "Mobile no", value: profile?.mobile },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-xl bg-surface p-3"
            >
              <row.icon className="shrink-0 text-brand" />
              <span className="shrink-0 text-sm text-gray-400">{row.label}</span>
              <span className="ml-auto min-w-0 break-all text-right font-medium">
                {row.value || "N/A"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="btn btn-primary btn-sm px-6"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetailsPage;
