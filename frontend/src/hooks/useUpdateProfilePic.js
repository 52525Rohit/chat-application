import { useState } from "react";
import toast from "react-hot-toast";
import { updateProfilePic } from "../api/userApi";
import { useAuth } from "../context/AuthProvider";

const useUpdateProfilePic = () => {
  const [authUser, setAuthUser] = useAuth();
  const [preview, setPreview] = useState(
    () => localStorage.getItem("profileImage") || null
  );

  const uploadProfilePic = async (file) => {
    if (!file || !authUser?.employeeData?.id) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result);
      setPreview(reader.result);
    };

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      const data = await updateProfilePic(formData);
      const updatedAuthUser = {
        employeeData: { ...authUser.employeeData, ...data.user },
      };
      localStorage.setItem("userData", JSON.stringify(updatedAuthUser));
      localStorage.removeItem("profileImage");
      setAuthUser(updatedAuthUser);
      setPreview(null);
      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  return { preview, uploadProfilePic };
};

export default useUpdateProfilePic;
