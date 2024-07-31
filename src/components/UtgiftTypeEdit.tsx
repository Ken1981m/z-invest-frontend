// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../config/config';
import { Back } from './Back';
import { postFormDataRequestOnUrl } from '../services/dataUtil';

export function UtgiftTypeEdit() {
    const location = useLocation();
    const { item } = location.state || {};

    const [responseMessage, setResponseMessage] = useState('');

    const [id, setId] = useState(item.id);

    const [navn, setNavn] = useState(item.navn);
    const [beskrivelse, setBeskrivelse] = useState(item.beskrivelse);
    const [mnduavhengig, setMnduavhengig] = useState(item.mndUavhengig ? 1 : 0);


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { id, navn, beskrivelse, mnduavhengig };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/oppdaterUtgiftType", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Utgift type " + navn + " er oppdatert.");
              }
              else {
                setResponseMessage("Feilet ved oppdatering av utgift type");
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

    const handleMnduavhengigChange = event => {
      setMnduavhengig(event.target.checked ? 1 : 0);
    };

    return (
        <>
            <Back/>
            <div>
            <h1>Rediger utgift type</h1>
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
                Måned uavhengig:     
                <p>
                <input 
                    type="checkbox" 
                    checked={mnduavhengig === 1} 
                    onChange={handleMnduavhengigChange} 
                />
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