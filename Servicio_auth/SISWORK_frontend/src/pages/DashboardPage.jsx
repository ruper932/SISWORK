import { useState } from "react";
import api from "../api/client";

function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const handleLoadProfile = async () => {
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo cargar el perfil");
    }
  };

  return (
    <section className="card">
      <h2>Dashboard</h2>
      <button onClick={handleLoadProfile}>Cargar mi perfil</button>

      {error && <p className="error">{error}</p>}
      {profile && (
        <pre className="result">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </section>
  );
}

export default DashboardPage;