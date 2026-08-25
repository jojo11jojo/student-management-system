import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
     const response = await fetch("https://student-management-api-7rcr.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      onLogin(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>Login to continue</p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {error && (
          <p className="error">{error}</p>
        )}

        <p className="auth-switch">
          New user?

          <button
            type="button"
            onClick={onRegister}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;