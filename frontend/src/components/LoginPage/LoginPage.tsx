import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle the form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    try {
      // Send a POST request to the backend with username and password
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      // Handle non-2xx responses
      if (!response.ok) {
        throw new Error("Login failed! Please check your credentials.");
      }

      // Parse the JSON response from the backend
      const data = await response.json();

      // Store the JWT in localStorage (or any storage mechanism)
      localStorage.setItem("token", data.jwt);

      // Redirect to the chat page after successful login
      window.location.href = "/chat";
    } catch (err: any) {
      // Display an error message if login fails
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
