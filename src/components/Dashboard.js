import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { CompanyContext } from '../context/CompanyContext'; // Import CompanyContext
import AuthContext from '../context/AuthContext'; // Import AuthContext
import ClientBox from './ClientBox'; // Import ClientBox component
import './Dashboard.css'; // Import Dashboard.css for styling


const Dashboard = () => {
  const { COMPANY_MAPPING, allCalls } = useContext(CompanyContext); // Access data from CompanyContext
  const { userRole, companyId } = useContext(AuthContext); // Access userRole and companyId from AuthContext
  const [clientCallCounts, setClientCallCounts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // If the user is a client, redirect to their specific client detail page
    if (userRole === 'client') {
      navigate(`/client/${companyId}`);
      return; // Stop execution if redirecting
    }

    if (userRole === 'admin' && COMPANY_MAPPING) {
      // Use context data to compute call counts
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const callCounts = Object.keys(COMPANY_MAPPING).reduce((acc, companyId) => {
        const callsForCompany = allCalls[companyId] || [];
        const recentCallsCount = callsForCompany.filter(call => new Date(call.start_time) >= thirtyDaysAgo).length;
        acc[companyId] = recentCallsCount;
        return acc;
      }, {});

      const sortedClientCallCounts = Object.keys(COMPANY_MAPPING).map(companyId => ({
        companyId,
        companyName: COMPANY_MAPPING[companyId],
        callCount: callCounts[companyId] || 0
      })).sort((a, b) => b.callCount - a.callCount);

      setClientCallCounts(sortedClientCallCounts);
    }
  }, [userRole, companyId, COMPANY_MAPPING, allCalls, navigate]);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  if (userRole !== 'admin') return null; // Prevent rendering if the user is not an admin

  return (
    <div className="dashboard">
      <h1>Client Performance Overview</h1>
      <div className="client-boxes">
        {clientCallCounts
          .slice(0, showMore ? clientCallCounts.length : 8)
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
