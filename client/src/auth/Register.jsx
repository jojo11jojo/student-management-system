import { useState } from "react";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
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
          data.message || "Registration failed"
        );
      }

      setMessage("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Register as a new user</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        {message && (
          <p className="success">{message}</p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}

        <p className="auth-switch">
          Already registered?

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;