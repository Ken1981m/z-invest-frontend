// @ts-nocheck
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postFormDataRequestOnUrl } from "../services/dataUtil";
import { config } from "../config/config";
import { Back } from "./Back";

export function LeilighetEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const { item } = location.state || {};

    const [responseMessage, setResponseMessage] = useState('');

    const [id, setId] = useState(item.id);

    const [navn, setNavn] = useState(item.navn);
    const [adresse, setAdresse] = useState(item.adresse);
    const [postnr, setPostnr] = useState(item.postnr);
    const [poststed, setPoststed] = useState(item.poststed);
    const [beskrivelse, setBeskrivelse] = useState(item.beskrivelse);

    function handleNavigateBack() {
        navigate('/leilighetadmin');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { id, navn, adresse, postnr, poststed, beskrivelse };

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
            <div className="padded-bottom">
                <button className="button-black" onClick={handleNavigateBack}>Tilbake</button>
            </div>  
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
                    <label>
                      Beskrivelse:
                      <textarea type="text" name="beskrivelse" value={beskrivelse} onChange={handleChange(setBeskrivelse)} />
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