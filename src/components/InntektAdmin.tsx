// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate, getUrlWithParamData, postFormDataRequestOnUrl, postRequestOnUrl } from './../services/dataUtil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { useNavigate } from 'react-router-dom';

export function InntektAdmin() {
   const navigate = useNavigate();

   const [leilighetRows, setLeilighetRows] = useState({});
   const [inntektTypeRows, setInntektTypeRows] = useState([]);

   const [leilighetId, setLeilighetId] = useState('');
   const [inntektTypeId, setInntektTypeId] = useState('');
   const [dato, setDato] = useState(null);
   const [belop, setBelop] = useState('');

   const [inntektData, setInntektData] = useState({});

   const [loading, setLoading] = useState(true);
   const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);          
            });
           
          fetchData(config.zInvestBackendUrl + 'search/hentInntektTyper')
            .then(res => res)
              .then(data => {
                setInntektTypeRows(data);
           });              

          if (leilighetId != null && inntektTypeId != null && dato != null) {
            const aar = dato.getFullYear();
            const formData = { leilighetId, inntektTypeId, aar };
            setLoading(true);

            fetchData(config.zInvestBackendUrl + 'search/hentInntekt' + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setInntektData(data);
                  setLoading(false);          
              });  
          }
    }, [leilighetId, inntektTypeId, dato]);

    const handleLeilighetIdChange = event => {
        setLeilighetId(event.target.value);
    };
    
    const handleInntektTypeIdChange = event => {
        setInntektTypeId(event.target.value);
    }
   
    function handleBelopChange(id,event) {
        const newValue = event.target.value;
        setInntektData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, belop: newValue } : item
          )
        );
    }
    
    const handleSubmit = (mnd, belop, label) => (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const formData = { leilighetId, inntektTypeId, formatertDato, mnd, belop };

        try {
            postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/oppdaterInntekt", formData)
            .then(res => res)
            .then(data => {
                if (data) {
                  setResponseMessage("Inntekten for " + label + " er oppdatert.");
                }
                else {
                  setResponseMessage("Feilet ved lagring av inntekt");
                }
            });         
      
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseMessage('Error: ' + error.message);
          }
    }

    const handleSlett = (id) => {
        var result = confirm("Vil du virkelig slette denne raden?");
        if (result) {
            setInntektData((prevData) => prevData.filter((item) => item.id !== id));
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettInntekt?id=" + id)
            .then(res => res)
            .then(data => {
                if(!data) {
                    setResponseMessage("Sletting feilet");
                }
            });     
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }    

 
    return (
     <>
        <Back/>
        <h1>Administrasjon av registrerte inntekter</h1>
        <h3>Leilighet</h3>
                <select value={leilighetId} onChange={handleLeilighetIdChange}>
                    <option key="">Velg leilighet</option>
                        {leilighetRows.map(row => (
                            <option key={row.id} value={row.id}>{row.navn}</option>
                        ))}
                </select>

        <h3>Inntekt type</h3>
                <select value={inntektTypeId} onChange={handleInntektTypeIdChange}>
                     <option key="">Velg inntekt type</option>
                      {inntektTypeRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>                       

        <h3>År</h3>
                <DatePicker
                     selected={dato}
                     onChange={dato => setDato(dato)}
                     dateFormat="yyyy"
                     showYearPicker
                />

        {inntektData.length > 0 ? (

          <form onSubmit={handleSubmit}>      
            <table>
                <thead>
                        <tr>
                            <th>Måned</th>
                            <th>Beløp</th>
                            <th>Konfigurasjon</th>
                        </tr>
                        </thead>
                 <tbody>
                    {inntektData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.label}</td>
                          <td><input type="number" value={item.belop} onChange={(event) => handleBelopChange(item.id, event)}/></td>
                          <td>
                                <button className="button-space" onClick={handleSubmit(item.mnd, item.belop, item.label)}>Oppdater</button>
                                <button onClick={() => handleSlett(item.id)}>Slett</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

          </form>
         ) : (
             <p/>
         )}
            {responseMessage && <p>{responseMessage}</p>}
        </>
      );

}