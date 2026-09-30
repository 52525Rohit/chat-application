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
    <div
      onClick={() => navigate("/profileDetails")}
      className="flex items-center gap-3 p-2.5 rounded-xl bg-base/60 hover:bg-surface/80 border border-surface/80 cursor-pointer transition-all duration-200 group"
    >
      {/* Avatar with Status Indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-brand/30 group-hover:ring-brand/70 transition-all">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Online Status Dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-base" />
      </div>

      {/* User Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-slate-100 truncate group-hover:text-brand-light transition-colors">
          {profile?.firstName || "User Profile"}
        </h2>
        <span className="text-xs text-slate-400 truncate">
          {profile?.email || "View Account"}
        </span>
      </div>
    </div>
  );
}

export default ProfileBadge;
