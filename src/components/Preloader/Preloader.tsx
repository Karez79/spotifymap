// src/components/Preloader/Preloader.tsx
import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <div className="spinner"></div>
      <p>Analyzing data...</p>
      <p>Drawing maps...</p>
    </div>
  );
};

export default Preloader;
