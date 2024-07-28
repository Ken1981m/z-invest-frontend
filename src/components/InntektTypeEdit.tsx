// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../config/config';
import { Back } from './Back';
import { postFormDataRequestOnUrl } from '../services/dataUtil';

export function InntektTypeEdit() {
    const location = useLocation();
    const { item } = location.state || {};

    const [responseMessage, setResponseMessage] = useState('');

    const [id, setId] = useState(item.id);

    const [navn, setNavn] = useState(item.navn);
    const [beskrivelse, setBeskrivelse] = useState(item.beskrivelse);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { id, navn, beskrivelse };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/oppdaterInntektType", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Inntekt type " + navn + " er oppdatert.");
              }
              else {
                setResponseMessage("Feilet ved oppdatering av inntekt type");
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
            <Back/>
            <div>
            <h1>Rediger inntekt type</h1>
            <form onSubmit={handleSubmit}>
                <p>
                  <label>
                    Navn: <input type="text" name="navn" value={navn} onChange={handleNavnChange} />
                  </label>
                </p>
                Beskrivelse:
                <p>
                  <label>
                    
                    <textarea type="text" name="beskrivelse" value={beskrivelse} onChange={handleBeskrivelseChange} />
                  </label>
                </p>               
                <p>
                  <button onClick={handleSubmit}>Lagre</button>
                </p>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
        
        </>
    )

}