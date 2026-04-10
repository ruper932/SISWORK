import { useState } from "react";
import api from "../api/client";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const response = await api.post("/auth/login", form);
      setResult(response.data);
      localStorage.setItem("token", response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <section className="card">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Entrar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <pre className="result">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}

export default LoginPage;