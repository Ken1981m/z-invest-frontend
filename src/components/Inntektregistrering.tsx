// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate, postFormDataRequestOnUrl } from './../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { ClipLoader } from 'react-spinners';

export function Inntektregistrering() {
    const [leilighetRows, setLeilighetRows] = useState([]);
    const [inntektTypeRows, setInntektTypeRows] = useState([]);

    const [leilighetId, setleilighetId] = useState('');
    const [inntektTypeId, setInntektTypeId] = useState('');
    const [inntektTypeBeskrivelse, setInntektTypeBeskrivelse] = useState('');
    const [dato, setDato] = useState(null);
    const [belop, setBelop] = useState('');

    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const clearFormData = () => {
      setleilighetId('');
      setInntektTypeId('');
      setDato(null);
      setBelop('');
      setInntektTypeBeskrivelse('');
    }

    useEffect(() => {
      fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
            });

      fetchData(config.zInvestBackendUrl + 'search/hentInntektTyper')
          .then(res => res)
            .then(data => {
              setInntektTypeRows(data);
              setLoading(false);  
            });            

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const formData = { leilighetId, inntektTypeId, formatertDato, belop };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/leggTilInntekt", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Inntekten for " + formatertDato + " er lagret.");
                clearFormData()
              }
              else {
                setResponseMessage("Feilet ved lagring av inntekt");
              }
          });         
    
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          setResponseMessage('Error: ' + error.message);
        }

    };

    const handleLeilighetIdChange = event => {
        setleilighetId(event.target.value);
    };

    const handleInntektTypeIdChange = event => {
        setInntektTypeId(event.target.value);
        const inntektTypeRow =  inntektTypeRows.find(row => row.id === Number(event.target.value));
        setInntektTypeBeskrivelse(inntektTypeRow.beskrivelse);
    };

   
    function handleBelopChange(event) {
        setBelop(event.target.value);
    }

    if (loading) {
      return (
      <div className="spinner-container">
          <ClipLoader />
      <div>Loading...</div>
      </div>
      );
  }   


    return (
      <>
      <div id="form-container">
            <Back/>
        
            <h1>Registrer ny inntekt</h1>

            <form onSubmit={handleSubmit}>

                <h3>Leilighet</h3>
                <div className="form-group">
                  <select value={leilighetId} onChange={handleLeilighetIdChange}>
                        <option key="">Velg leilighet</option>
                        {leilighetRows.map(row => (
                          <option key={row.id} value={row.id}>{row.navn}</option>
                        ))}
                  </select>
                </div>

                <h3>Inntekt type</h3>
                <div className="form-group">
                  <select value={inntektTypeId} onChange={handleInntektTypeIdChange}>
                      <option key="">Velg inntekt type</option>
                        {inntektTypeRows.map(row => (
                          <option key={row.id} value={row.id}>{row.navn}</option>
                        ))}
                  </select>
                </div>

                {inntektTypeBeskrivelse && 
                  <p>
                    <b>Beskrivelse av valgte inntekt type: </b>
                  {inntektTypeBeskrivelse}
                  </p>
                }

                <h3>Dato</h3>
                <div className="form-group">
                  <DatePicker
                      selected={dato}
                      onChange={date => setDato(date)}
                      minDate={new Date(2019,0,1)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                  />
                </div>

                <h3>Beløp</h3>
                <div className="form-group">
                  <input type="number" value={belop} onChange={handleBelopChange}/>
                </div>
                
                <p>
                  <button className="button-space" onClick={handleSubmit}>Lagre</button>
                </p>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
      </>
    );
}
