import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CompanyContext } from '../context/CompanyContext'; 
import './ClientDetail.css'; 
import play from '../assets/play.png';
import nope from '../assets/nope.png';

const ClientDetail = () => {
  const { companyId } = useParams();
  const { COMPANY_MAPPING, entriesLast24Hours, gravityFormEntries, totalCalls, callsLast24Hours, trend30Days, trend24Hours } = useContext(CompanyContext);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [expandedEntries, setExpandedEntries] = useState([]);
  const [showMoreCalls, setShowMoreCalls] = useState(false);
  const [showMoreEntries, setShowMoreEntries] = useState(false);
  
  const navigate = useNavigate();
  
  const handleShowMoreCalls = () => {
    setShowMoreCalls(!showMoreCalls);
  };
  
  const handleShowMoreEntries = () => {
    setShowMoreEntries(!showMoreEntries);
  };
  
  const handleToggleExpand = (id) => {
    setExpandedEntries((prevExpandedEntries) =>
      prevExpandedEntries.includes(id)
        ? prevExpandedEntries.filter((entryId) => entryId !== id)
        : [...prevExpandedEntries, id]
    );
  };
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        const calls = response.data;

        // Sort calls by start time in descending order
        const sortedCalls = calls.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        
        // Filter calls from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCalls = calls.filter(call => new Date(call.start_time) >= thirtyDaysAgo);

        // Filter calls from the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
        const recent24HourCalls = calls.filter(call => new Date(call.start_time) >= twentyFourHoursAgo);

        setFilteredData(sortedCalls);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setError('Error fetching client data. Please try again later.');
      }
    };

    fetchClientData();
  }, [companyId]);

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
      <h1>{COMPANY_MAPPING[companyId]} Interaction Hub</h1>
      <div className="stats">
        <p className='call-label'>New Chats: <span className={`number ${entriesLast24Hours?.[companyId] > 0 ? 'trend-up' : ''}`}>{entriesLast24Hours?.[companyId] || 0}</span></p>
        <p className='call-label'>Total Calls: <span className={`number ${trend30Days[companyId]}`}>{totalCalls[companyId] || 0}</span></p>
        <p className='call-label' >Calls Today: <span className={`number ${trend24Hours[companyId]}`}>{callsLast24Hours[companyId] || 0}</span></p>
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
            {filteredData.slice(0, showMoreCalls ? filteredData.length : 5).map((call) => (
              <tr key={call.call_id}>
                <td>{call.customer_name}</td>
                <td>
                  {call.customer_phone_number ? (
                    <a className='phone' href={`tel:${call.customer_phone_number}`}>
                      {`(${call.customer_phone_number.slice(2, 5)}) ${call.customer_phone_number.slice(5, 8)}-${call.customer_phone_number.slice(8)}`}
                    </a>
                  ) : (
                    'N/A'
                  )}
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
          {filteredData.length > 5 && (
            <div className="show-more-container">
              <button className="show-more-button" onClick={handleShowMoreCalls}>
                {showMoreCalls ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </table>
      ) : (
        <p>No calls found for this client.</p>
      )}
      <h2>Gravity Forms Entries</h2>
      <div className="gravity-forms-data">
        {gravityFormEntries.length > 0 ? (
          <table className="gravity-forms-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {gravityFormEntries
                .filter(entry => entry.company_id === companyId) // Filter entries by selected company
                .slice(0, showMoreEntries ? gravityFormEntries.length : 5)
                .map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td>
                    <td>
                      {entry.phone ? (
                        <a className='phone' href={`tel:${entry.phone}`}>
                          {`(${entry.phone.slice(1, 4)}) ${entry.phone.slice(4, 7)}-${entry.phone.slice(7)}`}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{entry.email}</td>
                    <td>
                      {entry.message?.length > 100 ? (
                        <>
                          {expandedEntries.includes(entry.id) ? (
                            <>
                              {entry.message}
                              <button className='show-button' onClick={() => handleToggleExpand(entry.id)}>Show Less</button>
                            </>
                          ) : (
                            <>
                              {entry.message.substring(0, 100)}...
                              <button className='show-button' onClick={() => handleToggleExpand(entry.id)}>Show More</button>
                            </>
                          )}
                        </>
                      ) : (
                        entry.message
                      )}
                    </td>
                    <td>{new Date(entry.date_created).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
            {gravityFormEntries.length > 5 && (
              <div className="show-more-container">
                <button className="show-more-button" onClick={handleShowMoreEntries}>
                  {showMoreEntries ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </table>
        ) : (
          <p>No Gravity Forms entries found.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;
