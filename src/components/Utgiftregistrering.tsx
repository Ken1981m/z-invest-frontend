// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, postFormDataRequestOnUrl } from './../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config';
import { Back } from './Back.js';

export function Utgiftregistrering() {
    const [leilighetRows, setLeilighetRows] = useState([]);
    const [utgiftTypeRows, setUtgiftTypeRows] = useState([]);

    const [leilighetId, setleilighetId] = useState('');
    const [utgiftTypeId, setUtgiftTypeId] = useState('');
    const [dato, setDato] = useState(null);
    const [belop, setBelop] = useState('');

    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const clearFormData = () => {
      setleilighetId('');
      setUtgiftTypeId('');
      setDato(null);
      setBelop('');
    }

    useEffect(() => {
      fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
      .then(res => res)
        .then(data => {
            setLeilighetRows(data);
        });

      fetchData(config.zInvestBackendUrl + 'search/hentUtgiftTyper')
      .then(res => res)
        .then(data => {
          setUtgiftTypeRows(data);
          setLoading(false);  
        });     

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const formData = { leilighetId, utgiftTypeId, formatertDato, belop };

        try {
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/leggTilUtgift", formData)
          .then(res => res)
          .then(data => {
              if (data) {
                setResponseMessage("Utgiften for " + formatertDato + " er lagret.");
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

    const handleUtgiftTypeIdChange = event => {
        setUtgiftTypeId(event.target.value);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${month}-${year}`;
    }

    function handleBelopChange(event) {
        setBelop(event.target.value);
      }

    return (
      <>
        <Back/>
        <div>
            <h1>Registrer ny utgift</h1>

            <form onSubmit={handleSubmit}>

                <h2>Leilighet</h2>
                <select value={leilighetId} onChange={handleLeilighetIdChange}>
                      <option key="">Velg leilighet</option>
                      {leilighetRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>

                <h2>Utgift type</h2>
                <select value={utgiftTypeId} onChange={handleUtgiftTypeIdChange}>
                     <option key="">Velg utgift type</option>
                      {utgiftTypeRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>

                <h2>Dato</h2>
                <DatePicker
                     selected={dato}
                     onChange={date => setDato(date)}
                     dateFormat="MM/yyyy"
                     showMonthYearPicker
                />

                <h2>Beløp</h2>
                <input type="number" value={belop} onChange={handleBelopChange}/>

                <p>
                  <button className="button-space" onClick={handleSubmit}>Lagre</button>
                </p>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
      </>
    );
}