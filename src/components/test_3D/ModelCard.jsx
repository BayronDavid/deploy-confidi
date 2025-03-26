"use client";

import React from 'react';
import Image from 'next/image';
import './ModelCard.css';

const ModelCard = ({ model, onClick }) => {
  return (
    <div className="model-card" onClick={onClick}>
      <div className="model-card__thumbnail">
        {model.thumbnail ? (
          <div className="model-card__image-container">
            <img 
              src={model.thumbnail} 
              alt={model.name} 
              className="model-card__image"
            />
          </div>
        ) : (
          <div className="model-card__placeholder">
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      <h3 className="model-card__title">{model.name}</h3>
      <button className="model-card__view-button">Ver modelo</button>
    </div>
  );
};

export default ModelCard;
