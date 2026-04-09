import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  useEffect(() => {
    setAuthState({
      token: null,
      user: null,
      auth: false,
    });
    
    navigate('/login');
  }, [navigate]);
}
