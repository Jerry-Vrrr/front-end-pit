import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CompanyContext } from '../context/CompanyContext'; 
import './ClientDetail.css'; 
import play from '../assets/play.png';
import nope from '../assets/nope.png';

const ClientDetail = () => {
  const { companyId } = useParams();
  const [clientData, setClientData] = useState([]);
  const { COMPANY_MAPPING } = useContext(CompanyContext);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        const calls = response.data;
        setClientData(calls);
        setFilteredData(calls);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setError('Error fetching client data. Please try again later.'); // Set error state
      }
    };

    fetchClientData();
  }, [companyId]);

  const handleFilterChange = (selectedFilter) => {
    try {
      setFilter(selectedFilter);

      let filtered = clientData;

      if (selectedFilter === 'over2minutes') {
        filtered = clientData.filter(call => call.duration > 120);
      } else if (selectedFilter === 'repeat') {
        const callMap = new Map();
        filtered = clientData.filter(call => {
          if (callMap.has(call.customer_phone_number)) {
            return true;
          } else {
            callMap.set(call.customer_phone_number, true);
            return false;
          }
        });
      } else {
        filtered = clientData; // Show all calls if filter is set to "all"
      }

      setFilteredData(filtered);
    } catch (error) {
      console.error('Error applying filter:', error);
      setError('Error applying filter. Please try again later.'); // Set error state
      navigate('/'); // Redirect to home page or another page if necessary
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="client-detail-container">
      <h1>Client Detail for {COMPANY_MAPPING[companyId]}</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('all')}>All Calls</button>
        <button onClick={() => handleFilterChange('over2minutes')}>Calls Over 2 Minutes</button>
        <button onClick={() => handleFilterChange('repeat')}>Repeat Calls</button>
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
    {`(${call.customer_phone_number.slice(2, 5)}) ${call.customer_phone_number.slice(4, 7)}-${call.customer_phone_number.slice(8)}`}
  </a>
</td>                <td>{new Date(call.start_time).toLocaleString()}</td>
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
