// frontend/src/components/ClientDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClientDetail = () => {
  const { companyId } = useParams();
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
        setClientData(response.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, [companyId]);

  return (
    <div>
      <h1>Client Detail</h1>
      <p>Company ID: {companyId}</p>
      {/* Render client data here */}
      {clientData.length > 0 ? (
        <ul>
          {clientData.map((call) => (
            <li key={call.call_id}>{call.customer_name} - {call.start_time}</li>
          ))}
        </ul>
      ) : (
        <p>No calls found for this client.</p>
      )}
    </div>
  );
};

export default ClientDetail;
