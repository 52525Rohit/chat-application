import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getProfilePicUrl } from "../../api/axiosClient";
import defaultAvatar from "../../../public/user.jpg";

function ProfileBadge() {
  const navigate = useNavigate();
  const [authUser] = useAuth();

  const profile = authUser?.employeeData;
  const profilePic =
    localStorage.getItem("profileImage") ||
    getProfilePicUrl(profile?.profilePic) ||
    defaultAvatar;

  return (
    <div className="relative left-46 bottom-9">
      <div className="avatar">
        <div className="w-16 rounded-full"></div>
        <div className="relative">
          <h2>{"🟢"}</h2>
        </div>

        <div className="absolute w-12 rounded-full right-5">
          <img
            src={profilePic}
            alt="Profile"
            onClick={() => navigate("/profileDetails")}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div>
        <h1 className="relative left-4 text-red-400">{profile?.firstName}</h1>
      </div>
    </div>
  );
}

export default ProfileBadge;
