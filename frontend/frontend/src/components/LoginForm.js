import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import './LoginForm.css'; // Import the CSS file

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // For sign-up mode
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [loading, setLoading] = useState(false); // Add loading state

  const { login } = useContext(AuthContext); // Access the login function from the AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    setLoading(true); 

    try {
      const url = isSignUp ? "http://localhost:3000/sign_up" : "http://localhost:3000/sign_in";
      
      const data = isSignUp
        ? { user: { email, password, password_confirmation: passwordConfirmation } }
        : { user: { email, password } };

      // Log the data before sending it to the backend

      const response = await axios.post(url, data);

      // Log the response from the server

      // Add a log to see what sessionToken is
      const sessionToken = response.headers["x-session-token"];

      if (sessionToken) {
        login(sessionToken);
      } else {
        setError("No session token returned");
        console.error("No session token in response headers");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Error during authentication:", err);
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {isSignUp && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </button>
        <p>
          {isSignUp ? (
            <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)}>Login here</button></span>
          ) : (
            <span>Don't have an account? <button type="button" onClick={() => setIsSignUp(true)}>Sign up here</button></span>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
