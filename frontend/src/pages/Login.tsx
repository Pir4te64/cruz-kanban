import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USERS = [
  "ADMIN",
  "VICTOR",
  "BRIAN",
  "DANIEL",
  "DANNYS",
  "FELIX",
  "MARIO",
  "PEDRO",
];
const PASSWORD = "12345678";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWelcome("");
    const userUpper = formData.user.trim().toUpperCase();
    if (!USERS.includes(userUpper) || formData.password !== PASSWORD) {
      setError("Usuario o contraseña incorrectos");
      return;
    }
    setWelcome(`¡Bienvenido, ${userUpper}!`);
    localStorage.setItem("kanban_user", userUpper);
    setLoggedIn(true);
  };

  useEffect(() => {
    if (loggedIn) {
      // Redirigir al dashboard después de un pequeño delay para mostrar el mensaje
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    }
  }, [loggedIn, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fff", padding: 32, borderRadius: 8 }}
      >
        <input
          type="text"
          name="user"
          placeholder="Usuario"
          value={formData.user}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 16, width: 200 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 16, width: 200 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          LOGIN
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {welcome && (
          <div style={{ color: "green", marginTop: 8, fontWeight: "bold" }}>
            {welcome}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
