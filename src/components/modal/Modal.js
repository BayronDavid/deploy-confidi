import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';

function Modal({ isOpen, onClose, onExited, title, children }) {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else {
      setClosing(true);
    }
  }, [isOpen]); 

  const handleTransitionEnd = () => {
    if (closing) {
      setVisible(false);
      onExited && onExited();
    }
  };

  const handleClose = () => {
    onClose && onClose();
    setClosing(true);
  };

  const handleOverlayClick = (e) => {
    // Solo cerrará si el clic es directamente en el overlay (no en su contenido)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!visible) return null;
  return (
    <div 
      className={`modal-overlay ${closing ? 'modal--closing' : 'modal--open'}`} 
      onTransitionEnd={handleTransitionEnd}
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
