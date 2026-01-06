// src/pages/AuthCallbackPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (code) {
          // Échanger le code contre une session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (token_hash && type === "email") {
          // Confirmer l'email avec le token_hash
          const { error: confirmError } = await supabase.auth.verifyOtp({ token_hash, type });
          if (confirmError) throw confirmError;
        }

        // Récupérer la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Rediriger vers la page de complétion de profil
        navigate("/complete-profile", { replace: true });
      } catch (err) {
        setError(err.message);
        console.error("Erreur dans AuthCallbackPage:", err);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h3>Easy Sécurité</h3>
      <p>Validation en cours...</p>
    </div>
  );
}
