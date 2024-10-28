// src/components/Modal.js
import React from 'react';
import './Modal.css'; // Importing the CSS for styling

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
