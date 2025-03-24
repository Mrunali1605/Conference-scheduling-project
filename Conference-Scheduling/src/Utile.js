import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
  toast.success(msg, { position: "top-right" });
};

export const handleError = (msg) => {
  toast.error(msg, { position: "top-right" });
};

export const checkAdminStatus = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole === "admin";
};

export const requireAdmin = (navigate) => {
  if (!checkAdminStatus()) {
    navigate("/unauthorized");
    return false;
  }
  return true;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  handleError(message);
  return message;
};