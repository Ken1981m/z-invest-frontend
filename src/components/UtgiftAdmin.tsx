// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate, getUrlWithParamData, postFormDataRequestOnUrl, postRequestOnUrl } from './../services/dataUtil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { useNavigate } from 'react-router-dom';

export function UtgiftAdmin() {
   const navigate = useNavigate();

   const [leilighetRows, setLeilighetRows] = useState({});
   const [utgiftTypeRows, setUtgiftTypeRows] = useState([]);

   const [leilighetId, setLeilighetId] = useState('');
   const [utgiftTypeId, setUtgiftTypeId] = useState('');
   const [dato, setDato] = useState(null);
   const [belop, setBelop] = useState('');

   const [utgiftData, setUtgiftData] = useState({});

   const [loading, setLoading] = useState(true);
   const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);          
            });
           
          fetchData(config.zInvestBackendUrl + 'search/hentUtgiftTyper')
            .then(res => res)
              .then(data => {
                setUtgiftTypeRows(data);
           });              

          if (leilighetId != null && utgiftTypeId != null && dato != null) {
            const aar = dato.getFullYear();
            const formData = { leilighetId, utgiftTypeId, aar };
            setLoading(true);

            fetchData(config.zInvestBackendUrl + 'search/hentUtgift' + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setUtgiftData(data);
                  setLoading(false);          
              });  
          }
    }, [leilighetId, utgiftTypeId, dato]);

    const handleLeilighetIdChange = event => {
        setLeilighetId(event.target.value);
    };
    
    const handleUtgiftTypeIdChange = event => {
        setUtgiftTypeId(event.target.value);
    }
   
    function handleBelopChange(id,event) {
        const newValue = event.target.value;
        setUtgiftData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, belop: newValue } : item
          )
        );
    }
    
    const handleSubmit = (mnd, belop, label) => (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const formData = { leilighetId, utgiftTypeId, formatertDato, mnd, belop };

        try {
            postFormDataRequestOnUrl(config.zInvestBackendUrl + "persist/oppdaterUtgift", formData)
            .then(res => res)
            .then(data => {
                if (data) {
                  setResponseMessage("Utgiften for " + label + " er oppdatert.");
                }
                else {
                  setResponseMessage("Feilet ved lagring av utgift");
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
            setUtgiftData((prevData) => prevData.filter((item) => item.id !== id));
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettUtgift?id=" + id)
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
        <h1>Administrasjon av registrerte utgifter</h1>
        <h3>Leilighet</h3>
                <select value={leilighetId} onChange={handleLeilighetIdChange}>
                    <option key="">Velg leilighet</option>
                        {leilighetRows.map(row => (
                            <option key={row.id} value={row.id}>{row.navn}</option>
                        ))}
                </select>

        <h3>Utgift type</h3>
                <select value={utgiftTypeId} onChange={handleUtgiftTypeIdChange}>
                     <option key="">Velg utgift type</option>
                      {utgiftTypeRows.map(row => (
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

        {utgiftData.length > 0 ? (

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
                    {utgiftData.map((item) => (
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