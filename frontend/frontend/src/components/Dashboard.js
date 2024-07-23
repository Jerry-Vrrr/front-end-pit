// frontend/src/components/Dashboard.js
import React, { useContext, useState, useEffect } from 'react';
import { CompanyContext } from '../context/CompanyContext'; // Import CompanyContext
import ClientBox from './ClientBox'; // Import ClientBox component
import axios from 'axios';
import './Dashboard.css'; // Import Dashboard.css for styling

const Dashboard = () => {
  const { COMPANY_MAPPING } = useContext(CompanyContext); // Access COMPANY_MAPPING from context
  const [clientCallCounts, setClientCallCounts] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchCallData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/call_rail_data');
        const calls = response.data;
        
        // Count the number of calls for each company
        const callCounts = {};
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        calls.forEach(call => {
          const companyId = call.company_id;
          if (!callCounts[companyId]) {
            callCounts[companyId] = 0;
          }
          if (new Date(call.start_time) >= thirtyDaysAgo) {
            callCounts[companyId]++;
          }
        });

        // Convert to an array and sort by call count in descending order
        const sortedClientCallCounts = Object.keys(COMPANY_MAPPING).map(companyId => ({
          companyId,
          companyName: COMPANY_MAPPING[companyId],
          callCount: callCounts[companyId] || 0
        })).sort((a, b) => b.callCount - a.callCount);

        setClientCallCounts(sortedClientCallCounts);
      } catch (error) {
        console.error('Error fetching call data:', error);
      }
    };

    fetchCallData();
  }, [COMPANY_MAPPING]);

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="dashboard">
      <h1>Client Dashboard</h1>
      <div className="client-boxes">
        {clientCallCounts
          .slice(0, showMore ? clientCallCounts.length : 8) // Show all if showMore is true, else show only first 8
          .map(client => (
            <ClientBox key={client.companyId} companyId={client.companyId} companyName={client.companyName} totalCalls={client.callCount} />
          ))}
      </div>
      {clientCallCounts.length > 8 && (
        <button className="show-more-button" onClick={handleShowMore}>
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default Dashboard;
