import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProfileBadge from "../profile/ProfileBadge";
import { useAuth } from "../../context/AuthProvider";
import { clearSession, getRefreshToken } from "../../utils/authStorage";
import { logout } from "../../api/authApi";

function LogoutButton() {
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    clearSession();
    setAuthUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
    if (refreshToken) {
      logout(refreshToken).catch(() => {});
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-surface-2 p-3">
      <div className="min-w-0 flex-1">
        <ProfileBadge />
      </div>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
        className="shrink-0 rounded-full p-2 text-white transition hover:bg-surface-2 hover:text-brand"
      >
        <BiLogOutCircle className="text-3xl" />
      </button>
    </div>
  );
}

export default LogoutButton;
