import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("sessionToken") || null);

  const login = (token) => {
    console.log("Token received in login function:", token);  // Add this to check if the token is received
    setAuthToken(token);
    localStorage.setItem("sessionToken", token);
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("sessionToken");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
