import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return formattedDate;
};

const CallRailData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching aggregated data for all companies");
        const response = await axios.get('http://localhost:3000/api/v1/call_rail_data?company_id=YOUR_COMPANY_ID');
        console.log("Fetched Data:", response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Call Rail Data</h1>
      {data.length > 0 && (
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
            {data.map((item, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{item.customer_name || 'N/A'}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{formatDuration(item.duration)}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{formatDateTime(item.start_time)}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {item.recording_player && (
                    <a href={item.recording_player} target="_blank" rel="noopener noreferrer">
                      Play Recording
                    </a>
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
