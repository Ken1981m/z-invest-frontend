// @ts-nocheck
import React, { useState } from 'react';

const LeilighetValg = ( {leilighetRows, handleLeilighetIdChange} ) => {
 
    // Initialize state to track the checked state of each checkbox
    const [checkedItems, setCheckedItems] = useState(
        leilighetRows.reduce((acc, option) => {
        acc[option.id] = false;
        return acc;
      }, {})
    );
  
    // Handle change event for checkboxes
    const handleChange = (event) => {
      const { name, checked } = event.target;
      setCheckedItems((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
      handleLeilighetIdChange(name, checked);
    };
  
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        {leilighetRows.map((option) => (
          <label key={option.id}>
            <input
              type="checkbox"
              name={option.id}
              checked={checkedItems[option.id]}
              onChange={handleChange}
            />
            {option.navn}
          </label>
        ))}
      </div>
    );
  };
  
  export default LeilighetValg;