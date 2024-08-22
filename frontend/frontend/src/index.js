import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CompanyProvider } from './context/CompanyContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Wrap App with Router */}
      <AuthProvider> {/* AuthProvider should wrap CompanyProvider */}
        <CompanyProvider> {/* Wrap App with CompanyProvider */}
          <App />
        </CompanyProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
