import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProfileBadge from "../profile/ProfileBadge";
import { useAuth } from "../../context/AuthProvider";
import { clearSession } from "../../utils/authStorage";

function LogoutButton() {
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <hr />
      <div className="h-[10vh] bg-transparent">
        <div>
          <BiLogOutCircle
            className="text-5xl text-white hover:bg-slate-700 duration-300 cursor-pointer rounded-full p-2 ml-2 mt-1"
            onClick={handleLogout}
          />
        </div>

        <ProfileBadge />
      </div>
    </>
  );
}

export default LogoutButton;
