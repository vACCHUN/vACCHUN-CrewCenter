import { useEffect } from "react";
import { onLogout } from "../emitters/logoutEmitter";
import { useNavigate } from "react-router";

function useLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout((errMsg = "You have been logged out") => {
      localStorage.removeItem("accessToken");
      navigate("/login", { state: { errorMessage: errMsg } });
    });
  }, [navigate]);
}

export default useLogout;
