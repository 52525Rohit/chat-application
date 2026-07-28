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
    <div className="bg-gray-800 text-white h-screen">
      <div className="flex space-x-4 px-6 py-6 justify-center">
        <div className="avatar avatar-online">
          <div className="w-32 rounded-full">
            <img src={profilePic} alt="Your profile" />
          </div>
          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => uploadProfilePic(e.target.files[0])}
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1 cursor-pointer">
              Edit
            </div>
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-center space-x-2 p-4 px-4">
          <FaUserAlt className="relative" />
          <span className="font-bold">FullName:</span>
          <h1 className="text-red-400">{profile?.firstName || "N/A"}</h1>
        </div>
        <div className="flex justify-center p-4 px-4 space-x-2">
          <AiOutlineMail />
          <span className="font-bold">Email:</span>
          <h1 className="text-red-400">{profile?.email || "N/A"}</h1>
        </div>
        <div className="flex justify-center p-4 px-4 space-x-2">
          <IoCall />
          <span className="font-bold">Mobile No:</span>
          <h1 className="text-red-400">{profile?.mobile || "N/A"}</h1>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ProfileDetailsPage;
