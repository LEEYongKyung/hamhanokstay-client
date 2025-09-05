import React from 'react';
import logoFromSrc from '../assets/logo.svg';

const AssetTest = () => {
  return (
    <div style={{ border: '2px solid red', padding: '10px', margin: '10px', backgroundColor: 'white', zIndex: 1000, position: 'relative' }}>
      <h2>Asset Test Component</h2>
      <div>
        <h3>Image from public directory:</h3>
        <p>Path: /vite.svg</p>
        <img src="/vite.svg" alt="Vite logo from public" style={{ width: '100px' }} />
      </div>
      <hr />
      <div>
        <h3>Image from src/assets (imported):</h3>
        <p>Imported as a module</p>
        <img src={logoFromSrc} alt="Logo from src/assets" style={{ width: '100px' }} />
      </div>
    </div>
  );
};

export default AssetTest;
