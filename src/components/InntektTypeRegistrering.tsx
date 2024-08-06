// @ts-nocheck
import React, { useState } from 'react';
import { postFormDataRequestOnUrl } from './../services/dataUtil.js';
import { config } from '../config/config.js';
import { Back } from './Back';

export function InntektTypeRegistrering() {
    const [navn, setNavn] = useState('');
    const [beskrivelse, setBeskrivelse] = useState('');

    const [responseMessage, setResponseMessage] = useState('');

    const clearFormData = () => {
        setNavn('');
        setBeskrivelse('');
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { navn, beskrivelse };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/leggTilInntektType", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Inntekt type " + navn + " er lagret.");
                clearFormData()
              }
              else {
                setResponseMessage("Feilet ved lagring av inntekt type");
              }
          });         
    
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          setResponseMessage('Error: ' + error.message);
        }
    };

    const handleNavnChange = event => {
        setNavn(event.target.value);
    };
  
    const handleBeskrivelseChange = event => {
        setBeskrivelse(event.target.value);
    };

    return (
        <>        
        <div id="form-container">
          <Back/>
            <h1>Registrer ny inntekt type</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Navn: <input type="text" name="navn" value={navn} onChange={handleNavnChange} />
                  </label>
                </div>
                
                <div className="form-group">
                  <label>
                    Beskrivelse:                  
                    <textarea type="text" name="beskrivelse" value={beskrivelse} onChange={handleBeskrivelseChange} />
                  </label>
                </div>               
                <p>
                  <button onClick={handleSubmit}>Lagre</button>
                </p>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
      </>  
    )
}