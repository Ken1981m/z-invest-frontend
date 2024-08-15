// @ts-nocheck
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { postFormDataRequestOnUrl } from "../services/dataUtil";
import { config } from "../config/config";
import { Back } from "./Back";

export function LeilighetEdit() {
    const location = useLocation();
    const { item } = location.state || {};

    const [responseMessage, setResponseMessage] = useState('');

    const [id, setId] = useState(item.id);

    const [navn, setNavn] = useState(item.navn);
    const [adresse, setAdresse] = useState(item.adresse);
    const [postnr, setPostnr] = useState(item.postnr);
    const [poststed, setPoststed] = useState(item.poststed);


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { id, navn, adresse, postnr, poststed };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/oppdaterLeilighet", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Leilighet " + navn + " er oppdatert.");
              }
              else {
                setResponseMessage("Feilet ved oppdatering av leilighet");
              }
          });         
    
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          setResponseMessage('Error: ' + error.message);
        }
    };

    const handleChange = setter => event => {
        setter(event.target.value);
    };

    return (
        <>
            <Back/>
            <div>
            <h1>Rediger leilighet</h1>
            <form onSubmit={handleSubmit}>
                <p>
                  <label>
                    Navn: <input type="text" name="navn" value={navn} onChange={handleChange(setNavn)} />
                  </label>
                </p>
                <p>
                  <label>
                    Adresse: <input type="text" name="navn" value={adresse} onChange={handleChange(setAdresse)} />
                  </label>
                </p>
                <p>
                  <label>
                    Postnr: <input type="text" name="navn" value={postnr} onChange={handleChange(setPostnr)} />
                  </label>
                </p>
                <p>
                  <label>
                    Poststed: <input type="text" name="navn" value={poststed} onChange={handleChange(setPoststed)} />
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