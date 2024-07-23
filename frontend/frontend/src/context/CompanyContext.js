import React, { createContext, useState } from 'react';

// Define COMPANY_MAPPING object
const COMPANY_MAPPING = {
  "475663645": "Apricot",
  "432770919": "Brock",
  "754688700": "Brown Chiari",
  "707808192": "Conger",
  "196651924": "CPJ",
  "408997789": "Crowell",
  "788957891": "GM",
  "435195417": "Greenberg",
  "294642214": "KLAW",
  "533921350": "Kohan Bablove",
  "316384868": "Lewis",
  "612344072": "Lopez Humphries",
  "595022144": "Mahoney",
  "258732157": "Money",
  "427975086": "Rozas",
  "847306783": "Trust"
};

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState("475663645"); // Default to first company

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, COMPANY_MAPPING }}>
      {children}
    </CompanyContext.Provider>
  );
};
