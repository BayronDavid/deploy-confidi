'use client';

import React from 'react';
import './Loader.css';

export default function Loader({ size = 'medium', fullScreen = false, text }) {
  const getLoaderClass = () => {
    let className = 'loader';
    
    if (size === 'small') className += ' loader-small';
    else if (size === 'large') className += ' loader-large';
    else className += ' loader-medium';
    
    if (fullScreen) className += ' loader-fullscreen';
    
    return className;
  };
  
  return (
    <div className={fullScreen ? 'loader-container' : ''}>
      <div className={getLoaderClass()}>
        <div className="loader-spinner"></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
}
