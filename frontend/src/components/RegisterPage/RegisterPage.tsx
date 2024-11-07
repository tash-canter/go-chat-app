import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/StoreContext";

export const RegisterPage = observer(() => {
  const chatStore = useContext(StoreContext);
  const { username, password, setPassword, setUsername, setToken } = chatStore;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Perform registration logic
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed! Please check your credentials.");
      }

      const data = await response.json();

      setToken(data.jwt);

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
        <p style={styles.register}>
          Already have an account?{" "}
          <a href="/" style={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "500px",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as "center", // Specify the type explicitly
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0 1rem",
  },
  inputGroup: {
    textAlign: "left" as "left", // Specify the type explicitly
    marginBottom: "1rem",
  },
  label: {
    marginBottom: "0.5rem",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "-0.5rem",
  },
  button: {
    padding: "0.75rem",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#1976d2",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  register: {
    marginTop: "1.5rem",
    fontSize: "14px",
  },
  link: {
    color: "#1976d2",
    textDecoration: "none",
  },
};
