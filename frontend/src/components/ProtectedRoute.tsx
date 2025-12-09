import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import config from "../config";
import AuthContext from "../context/AuthContext";
import useAdminStatus from "../hooks/useAdminStatus";
import { throwError } from "../utils/throwError";
import { triggerLogout } from "../emitters/logoutEmitter";
import api from "../axios";
import useLogout from "../hooks/useLogout";

const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;

type ProtectedRouteParams = {
  adminRequired?: boolean;
  children: React.ReactNode;
};

function ProtectedRoute({ adminRequired = false, children }: ProtectedRouteParams) {
  useLogout();
  const navigate = useNavigate();
  const [loginValid, setLoginValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const isAdmin = useAdminStatus(userData);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await axios.get(`${VATSIM_URL}/api/user?client_id=${VATSIM_CLIENT_ID}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUserData = userRes.data.data;
        setUserData({ ...fetchedUserData, access_token: token });

        if (fetchedUserData.oauth.token_valid === "false") {
          throwError("Token invalid", null);
        }
        const verifyRes = await api.post(`/auth/verifyLogin`, { ...fetchedUserData, access_token: token });
        if (!verifyRes.data.allowed) {
          console.log(verifyRes?.data?.message ?? "Unknown login error");
          triggerLogout("Login expired");
        }

        setLoginValid(true);
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("accessToken");
        triggerLogout("Error while authenticating.");
        throwError("Error while authenticating: ", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!loading && loginValid && adminRequired && !isAdmin) {
      navigate("/");
    }
  }, [loading, loginValid, adminRequired, isAdmin, navigate]);

  if (loading) return <Loading message="Verifying login..." />;
  if (!loginValid) return null;
  if (adminRequired && !isAdmin) return null;

  return <AuthContext.Provider value={{ userData, isAdmin }}>{children}</AuthContext.Provider>;
}

export default ProtectedRoute;
