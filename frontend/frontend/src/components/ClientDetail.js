import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyContext } from '../context/CompanyContext'; 
import './ClientDetail.css'; 
import play from '../assets/play.png';
import nope from '../assets/nope.png';

const ClientDetail = () => {
  const { companyId } = useParams();
  const { COMPANY_MAPPING } = useContext(CompanyContext);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [totalCalls, setTotalCalls] = useState(0);
  const [callsLast24Hours, setCallsLast24Hours] = useState(0);
  const [trend30Days, setTrend30Days] = useState('');
  const [trend24Hours, setTrend24Hours] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        const calls = await response.json();
        
        // Sort calls by start time in descending order
        const sortedCalls = calls.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        
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
        // Example logic for trends, update with actual data comparison
        const previous30DaysCalls = recentCalls.length; // Placeholder, replace with actual data
        const previous24HourCalls = recent24HourCalls.length; // Placeholder, replace with actual data

        setTrend30Days(totalCalls >= previous30DaysCalls ? 'trend-up' : 'trend-down');
        setTrend24Hours(callsLast24Hours >= previous24HourCalls ? 'trend-up' : 'trend-down');

        setFilteredData(sortedCalls);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setError('Error fetching client data. Please try again later.');
      }
    };

    fetchClientData();
  }, [companyId, totalCalls, callsLast24Hours]);

  const handleFilterChange = (selectedFilter) => {
    try {
      setFilter(selectedFilter);

      let filtered = filteredData;

      if (selectedFilter === 'over2minutes') {
        filtered = filteredData.filter(call => call.duration > 120);
      } else if (selectedFilter === 'repeat') {
        const callMap = new Map();
        filtered = filteredData.filter(call => {
          if (callMap.has(call.customer_phone_number)) {
            return true;
          } else {
            callMap.set(call.customer_phone_number, true);
            return false;
          }
        });
      } else if (selectedFilter === 'unanswered') {
        filtered = filteredData.filter(call => !call.answered);
      } else {
        filtered = filteredData;
      }

      setFilteredData(filtered);
    } catch (error) {
      console.error('Error applying filter:', error);
      setError('Error applying filter. Please try again later.');
      navigate('/');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!COMPANY_MAPPING[companyId]) {
    return <p>Company not found.</p>;
  }

  return (
    <div className="client-detail-container">
      <h1>Client Detail for {COMPANY_MAPPING[companyId]}</h1>
      <div className="stats">
        <p className='call-label'>Total Calls: <span className={`number ${trend30Days}`}>{totalCalls || 0}</span></p>
        <p className='call-label' >Calls Today: <span className={`number ${trend24Hours}`}>{callsLast24Hours || 0}</span></p>
      </div>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('all')}>All Calls</button>
        <button onClick={() => handleFilterChange('over2minutes')}>Calls Over 2 Minutes</button>
        <button onClick={() => handleFilterChange('repeat')}>Repeat Calls</button>
        <button onClick={() => handleFilterChange('unanswered')}>Unanswered Calls</button>
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : filteredData.length > 0 ? (
        <table className="client-detail-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Number</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Recording</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((call) => (
              <tr key={call.call_id}>
                <td>{call.customer_name}</td>
                <td>
                  <a className='phone' href={`tel:${call.customer_phone_number}`}>
                    {`(${call.customer_phone_number.slice(2, 5)}) ${call.customer_phone_number.slice(5, 8)}-${call.customer_phone_number.slice(8)}`}
                  </a>
                </td>
                <td>{new Date(call.start_time).toLocaleString()}</td>
                <td>{formatDuration(call.duration)}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {call.recording_player ? (
                    <a href={call.recording_player} target="_blank" rel="noopener noreferrer">
                      <img src={play} alt="Play Recording" width="20" height="20" />
                    </a>
                  ) : (
                    <img src={nope} alt="No Recording" width="20" height="20" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No calls found for this client.</p>
      )}
    </div>
  );
};

export default ClientDetail;
