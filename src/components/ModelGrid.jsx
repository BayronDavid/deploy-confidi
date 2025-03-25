"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ModelCard from './ModelCard';
import './ModelGrid.css';

const ModelGrid = ({ models, onSelectModel }) => {
  return (
    <motion.div 
      className="model-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {models.map((model, index) => (
        <motion.div
          key={model.id}
          className="model-grid__item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ModelCard 
            model={model} 
            onClick={() => onSelectModel(model)} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ModelGrid;
