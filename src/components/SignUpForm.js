import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import './SignUpForm.css'; // You can style this similarly to the login form

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when form is submitted
    setError(null); // Clear previous error messages
  
    try {
      const response = await axios.post("http://localhost:3000/sign_up", {
        user: {
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        },
      });
  
      const sessionToken = response.headers["x-session-token"];
  
      if (sessionToken) {
        login(sessionToken); // Log in the user with the token
      } else {
        setError("No session token returned. Please contact support.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Display detailed validation errors returned from the backend
        setError(err.response.data.errors.join(", "));
      } else {
        setError("Sign-up failed due to an unknown error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );

};

export default SignUpForm;
