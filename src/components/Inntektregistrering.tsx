// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, postFormDataRequestOnUrl } from './../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';

export function Inntektregistrering() {
    const [leilighetRows, setLeilighetRows] = useState([]);
    const [inntektTypeRows, setInntektTypeRows] = useState([]);

    const [leilighetId, setleilighetId] = useState('');
    const [inntektTypeId, setInntektTypeId] = useState('');
    const [dato, setDato] = useState(null);
    const [belop, setBelop] = useState('');

    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const clearFormData = () => {
      setleilighetId('');
      setInntektTypeId('');
      setDato(null);
      setBelop('');
    }

    useEffect(() => {
      fetchData(config.zInvestBackendUrl + 'hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
            });

      fetchData(config.zInvestBackendUrl + 'hentInntektTyper')
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
          postFormDataRequestOnUrl(config.zInvestBackendUrl + "leggTilInntekt", formData)
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
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${month}-${year}`;
    }

    function handleBelopChange(event) {
        setBelop(event.target.value);
      }

    if (loading) {
        return <div>Loading...</div>;
    }    


    return (
      <>
        <Back/>
        <div>
            <h1>Registrer ny inntekt</h1>

            <form onSubmit={handleSubmit}>

                <h2>Leilighet</h2>
                <select value={leilighetId} onChange={handleLeilighetIdChange}>
                      <option key="">Velg leilighet</option>
                      {leilighetRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>

                <h2>Inntekt type</h2>
                <select value={inntektTypeId} onChange={handleInntektTypeIdChange}>
                     <option key="">Velg inntekt type</option>
                      {inntektTypeRows.map(row => (
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
