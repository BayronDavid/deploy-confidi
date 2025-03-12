'use client';

import { useScrollContext } from '@/context/ScrollContext';
import './ScrollProgress.css';

const ScrollProgress = () => {
  const { scrollProgress } = useScrollContext();
  
  return (
    <div className="scroll-progress-container">
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress * 100}%` }} 
      />
      <div className="scroll-percentage">
        {Math.round(scrollProgress * 100)}%
      </div>
    </div>
  );
};

export default ScrollProgress;