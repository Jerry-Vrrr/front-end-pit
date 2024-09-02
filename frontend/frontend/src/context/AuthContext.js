import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("sessionToken") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId") || null);

  const login = (token, role, loggedCompanyId) => {
    console.log("Token received in login function:", token);
    setAuthToken(token);
    setUserRole(role);
    setCompanyId(loggedCompanyId);

    localStorage.setItem("sessionToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("companyId", loggedCompanyId);
    console.log(role);
    console.log(loggedCompanyId);

  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    setCompanyId(null);

    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("companyId");
  };

  return (
    <AuthContext.Provider value={{ authToken, userRole, companyId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
