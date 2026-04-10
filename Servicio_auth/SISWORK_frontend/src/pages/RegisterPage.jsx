import { useState } from "react";
import api from "../api/client";

function RegisterPage() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    telefono: "",
    numero_whatsapp: "",
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
      const response = await api.post("/auth/register", form);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar usuario");
    }
  };

  return (
    <section className="card">
      <h2>Registro</h2>

      <form onSubmit={handleSubmit} className="form">
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="numero_whatsapp" placeholder="WhatsApp" value={form.numero_whatsapp} onChange={handleChange} />

        <button type="submit">Crear usuario</button>
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

export default RegisterPage;