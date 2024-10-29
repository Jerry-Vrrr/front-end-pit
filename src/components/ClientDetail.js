import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CompanyContext } from '../context/CompanyContext';
import AuthContext from '../context/AuthContext';
import Modal from '../components/Modal';
import './ClientDetail.css';
import play from '../assets/play.png';
import nope from '../assets/nope.png';

const ClientDetail = () => {
  const { companyId } = useParams();
  const { COMPANY_MAPPING, entriesLast24Hours, gravityFormEntries, allCalls, totalCalls, callsLast24Hours, trend30Days, trend24Hours } = useContext(CompanyContext);
  const { userRole } = useContext(AuthContext);
  const [filter, setFilter] = useState('all');
  const [expandedEntries, setExpandedEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState('');

  const openModal = (content, type) => {
    setModalContent(content);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalType('');
  };

  const getFilteredCalls = () => {
    let clientCalls = allCalls[companyId] || [];
    switch (filter) {
      case 'over2minutes':
        return clientCalls.filter(call => call.duration > 120);
      case 'repeat':
        const callMap = new Map();
        return clientCalls.filter(call => {
          if (callMap.has(call.customer_phone_number)) {
            return true;
          } else {
            callMap.set(call.customer_phone_number, true);
            return false;
          }
        });
      case 'unanswered':
        return clientCalls.filter(call => !call.answered);
      default:
        return clientCalls;
    }
  };

  const filteredCalls = getFilteredCalls().slice(0, 5); // Limit main view to 5 calls
  const filteredEntries = gravityFormEntries.filter(entry => entry.company_id === companyId).slice(0, 5); // Limit main view to 5 entries

  const handleToggleExpand = (id) => {
    setExpandedEntries((prevExpandedEntries) =>
      prevExpandedEntries.includes(id)
        ? prevExpandedEntries.filter((entryId) => entryId !== id)
        : [...prevExpandedEntries, id]
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!COMPANY_MAPPING[companyId]) {
    return <p>Company not found.</p>;
  }

  const renderCallsModal = () => (
    <table className="client-detail-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Duration</th>
          <th>Listen to Call</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {modalContent.map((call, index) => (
          <tr key={index}>
            <td>{call.customer_name}</td>
            <td>
              {call.customer_phone_number ? (
                <a className="phone" href={`tel:${call.customer_phone_number}`}>
                  {`(${call.customer_phone_number.slice(2, 5)}) ${call.customer_phone_number.slice(5, 8)}-${call.customer_phone_number.slice(8)}`}
                </a>
              ) : 'N/A'}
            </td>
            <td>{formatDuration(call.duration)}</td>
            <td>
              {call.recording_player ? (
                <a href={call.recording_player} target="_blank" rel="noopener noreferrer">
                  <img src={play} alt="Play Recording" width="20" height="20" />
                </a>
              ) : (
                <img src={nope} alt="No Recording" width="20" height="20" />
              )}
            </td>
            <td>{new Date(call.start_time).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderEntriesModal = () => (
    <table className="client-detail-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Email</th>
          <th>Message</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {modalContent.map((entry, index) => (
          <tr key={index}>
            <td>{entry.name}</td>
            <td>
  {entry.phone ? (
    <a className="phone" href={`tel:${entry.phone}`}>
      {(() => {
        const cleanedNumber = entry.phone.replace(/\D/g, ''); // Strip non-numeric characters
        if (cleanedNumber.length === 10) {
          return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
        } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith('1')) {
          return `+1 (${cleanedNumber.slice(1, 4)}) ${cleanedNumber.slice(4, 7)}-${cleanedNumber.slice(7)}`;
        } else {
          return entry.phone; // Display raw format if it doesn’t fit standard formats
        }
      })()}
    </a>
  ) : 'N/A'}
</td>

            <td>
              {entry.email ? (
                <a className="link" href={`mailto:${entry.email}`}>
                  {entry.email}
                </a>
              ) : 'N/A'}
            </td>
            <td className="truncate message">
              {expandedEntries.includes(entry.id) ? (
                <>
                  {entry.message}
                  <button className="show-button" onClick={() => handleToggleExpand(entry.id)}>Show Less</button>
                </>
              ) : (
                <>
                  {entry.message.substring(0, 100)}...
                  <button className="show-button" onClick={() => handleToggleExpand(entry.id)}>Read More</button>
                </>
              )}
            </td>
            <td>{new Date(entry.date_created).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="client-detail-container">
      <h1>{COMPANY_MAPPING[companyId]} Lead Hub</h1>
      <div className="stats">
        <p className="call-label">
          New Forms:
          <span className={`number ${entriesLast24Hours?.[companyId] > 0 ? 'trend-up' : ''}`}>
            {entriesLast24Hours?.[companyId] || 0}
          </span>
        </p>
        <p className="call-label">
          Total Calls:
          <span className={`number ${userRole === 'admin' ? trend30Days[companyId] : ''}`}>
            {totalCalls[companyId] || 0}
          </span>
        </p>
        <p className="call-label">
          New Calls:
          <span className={`number ${userRole === 'admin' ? trend24Hours[companyId] : ''}`}>
            {callsLast24Hours[companyId] || 0}
          </span>
        </p>
      </div>

      <h2>Call Rail</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All Calls</button>
        <button onClick={() => setFilter('over2minutes')}>Calls Over 2 Minutes</button>
        <button onClick={() => setFilter('repeat')}>Repeat Calls</button>
        <button onClick={() => setFilter('unanswered')}>Unanswered Calls</button>
      </div>
      {filteredCalls.length > 0 ? (
        <table className="client-detail-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Duration</th>
              <th>Listen to Call</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => (
              <tr key={call.call_id}>
                <td>{call.customer_name}</td>
                <td>
                  {call.customer_phone_number ? (
                    <a className="phone" href={`tel:${call.customer_phone_number}`}>
                      {`(${call.customer_phone_number.slice(2, 5)}) ${call.customer_phone_number.slice(5, 8)}-${call.customer_phone_number.slice(8)}`}
                    </a>
                  ) : 'N/A'}
                </td>
                <td>{formatDuration(call.duration)}</td>
                <td>
                  {call.recording_player ? (
                    <a href={call.recording_player} target="_blank" rel="noopener noreferrer">
                      <img src={play} alt="Play Recording" width="20" height="20" />
                    </a>
                  ) : (
                    <img src={nope} alt="No Recording" width="20" height="20" />
                  )}
                </td>
                <td>{new Date(call.start_time).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
          {getFilteredCalls().length > 5 && (
            <div className="show-more-container">
              <button className="show-more-button" onClick={() => openModal(getFilteredCalls(), 'calls')}>
                Show More
              </button>
            </div>
          )}
        </table>
      ) : (
        <p>No calls found for this client.</p>
      )}

      <h2>Gravity Forms Entries</h2>
      <div className="gravity-forms-data">
        {filteredEntries.length > 0 ? (
          <table className="gravity-forms-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>
  {entry.phone ? (
    <a className="phone" href={`tel:${entry.phone}`}>
      {(() => {
        const cleanedNumber = entry.phone.replace(/\D/g, ''); // Strip non-numeric characters
        if (cleanedNumber.length === 10) {
          return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
        } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith('1')) {
          return `+1 (${cleanedNumber.slice(1, 4)}) ${cleanedNumber.slice(4, 7)}-${cleanedNumber.slice(7)}`;
        } else {
          return entry.phone; // Display raw format if it doesn’t fit standard formats
        }
      })()}
    </a>
  ) : 'N/A'}
</td>

                  <td>
                    {entry.email ? (
                      <a className="link" href={`mailto:${entry.email}`}>
                        {entry.email}
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="truncate message">
                    {expandedEntries.includes(entry.id) ? (
                      <>
                        {entry.message}
                        <button className="show-button" onClick={() => handleToggleExpand(entry.id)}>Show Less</button>
                      </>
                    ) : (
                      <>
                        {entry.message.substring(0, 100)}...
                        <button className="show-button" onClick={() => handleToggleExpand(entry.id)}>Show More</button>
                      </>
                    )}
                  </td>
                  <td>{new Date(entry.date_created).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
            {gravityFormEntries.filter(entry => entry.company_id === companyId).length > 5 && (
              <div className="show-more-container">
                <button className="show-more-button" onClick={() => openModal(gravityFormEntries.filter(entry => entry.company_id === companyId), 'entries')}>
                  Show More
                </button>
              </div>
            )}
          </table>
        ) : (
          <p>No Gravity Forms entries found.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="modal-table-container">
            {modalType === 'calls' ? renderCallsModal() : renderEntriesModal()}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientDetail;
