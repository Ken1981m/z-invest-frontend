// @ts-nocheck
import React, { useState } from 'react';
import { postFormDataRequestOnUrl } from './../services/dataUtil.js';
import { config } from '../config/config.js';
import { Back } from './Back.js';

export function Leilighet() {

    const [navn, setNavn] = useState('');
    const [adresse, setAdresse] = useState('');
    const [postnr, setPostnr] = useState('');
    const [poststed, setPoststed] = useState('');

    const [responseMessage, setResponseMessage] = useState('');

    const clearFormData = () => {
      setNavn('');
      setAdresse('');
      setPostnr('');
      setPoststed('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { navn, adresse, postnr, poststed };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "leggTilLeilighet", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Leilighet " + navn + " er lagret.");
                clearFormData()
              }
              else {
                setResponseMessage("Feilet ved lagring av leilighet");
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

    const handleAdresseChange = event => {
      setAdresse(event.target.value);
    };

    const handlePostnrChange = event => {
      setPostnr(event.target.value);
    };

    const handlePoststedChange = event => {
      setPoststed(event.target.value);
    };


    return (
      <>
        <Back/>
        <div>
            <h1>Registrer ny leilighet</h1>
            <form onSubmit={handleSubmit}>
                <p>
                  <label>
                    Navn: <input type="text" name="navn" value={navn} onChange={handleNavnChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Adresse:
                    <input type="text" name="adresse" value={adresse} onChange={handleAdresseChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Postnummer:
                    <input type="text" name="postnr" value={postnr} onChange={handlePostnrChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Poststed:
                    <input type="text" name="poststed" value={poststed} onChange={handlePoststedChange} />
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