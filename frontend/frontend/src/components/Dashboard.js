import React, { useContext, useState } from 'react';
import { CompanyContext } from '../context/CompanyContext'; // Import CompanyContext
import ClientBox from './ClientBox'; // Import ClientBox component
import './Dashboard.css'; // Import Dashboard.css for styling

const Dashboard = () => {
  const { COMPANY_MAPPING } = useContext(CompanyContext);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="dashboard">
      <h1>Client Dashboard</h1>
      <div className="client-boxes">
        {Object.keys(COMPANY_MAPPING)
          .slice(0, showMore ? Object.keys(COMPANY_MAPPING).length : 8)
          .map((key) => (
            <ClientBox key={key} companyId={key} companyName={COMPANY_MAPPING[key]} />
          ))}
      </div>
      {Object.keys(COMPANY_MAPPING).length > 6 && (
        <button className="show-more-button" onClick={handleShowMore}>
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default Dashboard;
