import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  username: "",
  password: ""
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setMessage("Enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Login failed.");
        return;
      }

      sessionStorage.setItem("stocks.authenticated", "true");
      sessionStorage.setItem("stocks.username", form.username.trim());

      navigate(data.redirectUrl || "/dashboard", {
        replace: true,
        state: {
          username: form.username.trim()
        }
      });
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Stock Management</p>
          <h1>Sign in to access your workspace.</h1>
          <p className="hero-text">
            A clean entry point for monitoring positions, performance, and
            account activity.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="card-header">
            <p className="card-kicker">Member Access</p>
            <h2>Login</h2>
          </div>

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </label>

          <button className="login-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="card-footer">
            <span className="status-text">
              {message || "Use your account credentials."}
            </span>
            <a href="/" onClick={(event) => event.preventDefault()}>
              Forgot password?
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
