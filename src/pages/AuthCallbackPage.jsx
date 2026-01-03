// src/pages/AuthCallbackPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/complete-profile", { replace: true });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/complete-profile", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h3>Easy Sécurité</h3>
      <p>Validation en cours...</p>
    </div>
  );
}