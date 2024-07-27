import React, { useEffect, useState, useContext } from 'react';
import { CompanyContext } from '../context/CompanyContext';
import './ClientBox.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientBox = ({ companyId, companyName }) => {
  const { setSelectedCompany, entriesLast24Hours } = useContext(CompanyContext);
  const [totalCalls, setTotalCalls] = useState(0);
  const [callsLast24Hours, setCallsLast24Hours] = useState(0);
  const [trend30Days, setTrend30Days] = useState(null);
  const [trend24Hours, setTrend24Hours] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        const calls = response.data;

        // Filter calls from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCalls = calls.filter(call => new Date(call.start_time) >= thirtyDaysAgo);
        setTotalCalls(recentCalls.length);

        // Filter calls from the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
        const recent24HourCalls = calls.filter(call => new Date(call.start_time) >= twentyFourHoursAgo);
        setCallsLast24Hours(recent24HourCalls.length);

        // Add logic to compare and set trends
        const previous30DaysCalls = recentCalls.length; // Placeholder, replace with actual data
        const previous24HourCalls = recent24HourCalls.length; // Placeholder, replace with actual data

        setTrend30Days(totalCalls >= previous30DaysCalls ? 'trend-up' : 'trend-down');
        setTrend24Hours(callsLast24Hours >= previous24HourCalls ? 'trend-up' : 'trend-down');
      } catch (error) {
        console.error('Error fetching the call data', error);
      }
    };

    fetchClientData();
  }, [companyId, totalCalls, callsLast24Hours]);

  const handleClick = () => {
    setSelectedCompany(companyId);
  };

  return (
    <div className="client-box" onClick={handleClick}>
      <Link to={`/client/${companyId}`}>
        <h2>{companyName}</h2>
        <p className="total-calls">
          Total Calls: <span className={`number ${trend30Days}`}>{totalCalls}</span>
        </p>
        <p className="calls-today">
          Calls Today: <span className={`number ${trend24Hours}`}>{callsLast24Hours}</span>
        </p>
        <p className="chats-today">
          New Chats: <span className={`number ${entriesLast24Hours?.[companyId] > 0 ? 'trend-up' : ''}`}>{entriesLast24Hours?.[companyId] || 0}</span>
        </p>
      </Link>
    </div>
  );
};

export default ClientBox;
