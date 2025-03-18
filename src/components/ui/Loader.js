'use client';
import React from 'react';
import './Loader.css';

export default function Loader({
  variant = 'default', // 'default' | 'donut' | 'flower'
  size = 'medium',    // 'small' | 'medium' | 'large'
  fullScreen = false,
  text,
}) {
  const getLoaderClass = () => {
    let className = 'loader';
    if (size === 'small') className += ' loader-small';
    else if (size === 'large') className += ' loader-large';
    else className += ' loader-medium';
    if (fullScreen) className += ' loader-fullscreen';
    return className;
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'donut':
        return <div className="loader-spinner donut"></div>;
      case 'flower':
        return (
          <div className="flower-loader">
            <div className="petal petal1"></div>
            <div className="petal petal2"></div>
            <div className="petal petal3"></div>
            <div className="petal petal4"></div>
            <div className="petal petal5"></div>
            <div className="petal petal6"></div>
          </div>
        );
      case 'default':
      default:
        return <div className="loader-spinner"></div>;
    }
  };

  return (
    <div className={fullScreen ? 'loader-container' : ''}>
      <div className={getLoaderClass()}>
        {renderSpinner()}
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
}
