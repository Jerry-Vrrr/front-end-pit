import React, { useContext } from 'react';
import { CompanyContext } from '../context/CompanyContext';

const CallRailData = () => {
  const { COMPANY_MAPPING, totalCalls, callsLast24Hours, selectedCompany } = useContext(CompanyContext);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Call Rail Data</h1>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="company">Select Company: </label>
        <select id="company" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="">All Companies</option>
          {Object.keys(COMPANY_MAPPING).map(key => (
            <option key={key} value={key}>{COMPANY_MAPPING[key]}</option>
          ))}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Company</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Total Calls</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Calls Last 24 Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{COMPANY_MAPPING[selectedCompany]}</td>
            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{totalCalls[selectedCompany]}</td>
            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{callsLast24Hours[selectedCompany]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CallRailData;
