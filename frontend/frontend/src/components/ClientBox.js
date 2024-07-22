// frontend/src/components/ClientBox.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CompanyContext } from '../context/CompanyContext'; // Ensure correct path
import './ClientBox.css'; // Ensure you have a corresponding CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ClientBox = ({ companyId, companyName }) => {
  const [totalCalls, setTotalCalls] = useState(0);
  const { COMPANY_MAPPING } = useContext(CompanyContext);

  useEffect(() => {
    const fetchCallData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        const calls = response.data;

        // Filter calls from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCalls = calls.filter(call => new Date(call.start_time) >= thirtyDaysAgo);
        setTotalCalls(recentCalls.length);
      } catch (error) {
        console.error('Error fetching the call data', error);
      }
    };

    fetchCallData();
  }, [companyId]);

  return (
    <div className="client-box">
      <Link to={`/client/${companyId}`}>
        <h2>{companyName}</h2>
        <p>Total Calls: {totalCalls}</p>
      </Link>
    </div>
  );
};

export default ClientBox;
