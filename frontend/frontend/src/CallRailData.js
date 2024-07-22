import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CompanyContext } from './context/CompanyContext'; // Import CompanyContext

const CallRailData = () => {
  const { COMPANY_MAPPING } = useContext(CompanyContext); // Access COMPANY_MAPPING from context
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(''); // Default selected company is empty (show all)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/call_rail_data');
  
        // Sort data by start_time in descending order (newest to oldest)
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.start_time) - new Date(a.start_time);
        });
  
        setData(sortedData);
        setFilteredData(sortedData); // Initially set filtered data to all sorted data
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };
  
    fetchData();
  }, []);

  // Function to format duration from seconds to "mm:ss"
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Function to format date and time from ISO string
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    return formattedDate;
  };

  // Function to handle company selection change
  const handleCompanyChange = (event) => {
    const companyName = event.target.value;
    setSelectedCompany(companyName);

    // Filter data based on selected company
    if (companyName === '') {
      setFilteredData(data); // Show all data if no company selected
    } else {
      const filtered = data.filter(item => {
        const companyId = item.company_id;
        const customerName = item.customer_name;
        return companyId === companyName || customerName === companyName;
      });
      setFilteredData(filtered);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Call Rail Data</h1>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="company">Select Company: </label>
        <select id="company" value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">All Companies</option>
          {Object.keys(COMPANY_MAPPING).map(key => (
            <option key={key} value={key}>{COMPANY_MAPPING[key]}</option>
          ))}
        </select>
      </div>
      {filteredData.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Customer</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Duration</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Start Date & Time</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Recording Player</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{item.customer_name || 'N/A'}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{formatDuration(item.duration)}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{formatDateTime(item.start_time)}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {item.recording_player ? (
                    <a href={item.recording_player} target="_blank" rel="noopener noreferrer">
                      Play Recording
                    </a>
                  ) : (
                    'Not Applicable'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CallRailData;
