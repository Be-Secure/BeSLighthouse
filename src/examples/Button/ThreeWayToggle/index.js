import React, { useState } from 'react';
import './ThreeWayToggle.css';

const ThreeWayToggle = () => {
  const [value, setValue] = useState('Table'); // Initial value

  const handleToggle = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="main-container">
      <div
        className={`switch ${
          value === 'Table'
            ? 'left-position'
            : value === 'Graph'
            ? 'center-position'
            : 'right-position'
        }`}
      ></div>

      <input
        defaultChecked
        onChange={() => handleToggle('Table')}
        name="map-switch"
        id="left"
        type="radio"
        value="Table"
      />
      <label className={`left-label ${value === 'Table' && 'black-font'}`} htmlFor="left">
        <h4>Table</h4>
      </label>

      <input
        onChange={() => handleToggle('Graph')}
        name="map-switch"
        id="center"
        type="radio"
        value="Graph"
      />
      <label className={`center-label ${value === 'Graph' && 'black-font'}`} htmlFor="center">
        <h4>Graph</h4>
      </label>

      <input
        onChange={() => handleToggle('Arc')}
        name="map-switch"
        id="right"
        type="radio"
        value="Arc"
      />
      <label className={`right-label ${value === 'Arc' && 'black-font'}`} htmlFor="right">
        <h4>Arc</h4>
      </label>
    </div>
  );
};

export default ThreeWayToggle;
