import React, { useContext, useEffect } from 'react';
import { CompanyContext } from '../context/CompanyContext';
import './ClientBox.css';
import { Link } from 'react-router-dom';

const ClientBox = ({ companyId, companyName }) => {
  const { 
    setSelectedCompany, 
    totalCalls, 
    callsLast24Hours, 
    trend24Hours, 
    trend30Days, 
    entriesLast24Hours 
  } = useContext(CompanyContext);

  useEffect(() => {
  }, [companyId, totalCalls, callsLast24Hours, trend24Hours, trend30Days, entriesLast24Hours]);

  const handleClick = () => {
    setSelectedCompany(companyId);
  };

  return (
    <div className="client-box" onClick={handleClick}>
      <Link to={`/client/${companyId}`}>
        <h2>{companyName}</h2>
        <p className="total-calls">
          Total Calls: <span className={`number ${trend30Days[companyId] || ''}`}>{totalCalls[companyId] || 0}</span>
        </p>
        <p className="calls-today">
          Calls Today: <span className={`number ${trend24Hours[companyId] || ''}`}>{callsLast24Hours[companyId] || 0}</span>
        </p>
        <p className="chats-today">
          New Chats: <span className={`number ${entriesLast24Hours?.[companyId] > 0 ? 'trend-up' : ''}`}>{entriesLast24Hours?.[companyId] || 0}</span>
        </p>
      </Link>
    </div>
  );
};

export default ClientBox;
