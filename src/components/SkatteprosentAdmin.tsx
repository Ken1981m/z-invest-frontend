// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Back } from './Back';
import { config } from '../config/config';
import { fetchData, postFormDataRequestOnUrl, postRequestOnUrl } from '../services/dataUtil';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DatePicker from 'react-datepicker';

export function SkatteprosentAdmin() {
    const navigate = useNavigate();

    const [aar, setAar] = useState('');
    const [skatteprosent, setSkatteprosent] = useState('');
    const [dato, setDato] = useState(null);

    const [skatteprosentRows, setSkatteprosentRows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const [nydato, setNydato] = useState(null);
    const [visLeggTilNyRadKnapp, setVisLeggTilNyRadKnapp] = useState(false);

    function hentSkatteprosentData() {
      fetchData(config.zInvestBackendUrl + 'search/hentSkatteprosent')
        .then(res => res)
        .then(data => {
          setSkatteprosentRows(data);
          setLoading(false);
          setVisLeggTilNyRadKnapp(true);
        });
    }

    useEffect(() => {
        hentSkatteprosentData();           
    }, []);

    const handleSubmit = (id, hentetAar, skatteprosent, nydata) => (e) => {
        e.preventDefault();        

        const aar = dato !== null ? dato.getFullYear() : hentetAar;

        const formData = { id, aar, skatteprosent };

        const backendUrl = nydata 
        ? config.zInvestBackendUrl + "persist/leggTilSkatteprosent" 
        : config.zInvestBackendUrl + "persist/oppdaterSkatteprosent"

        try {
            postFormDataRequestOnUrl(backendUrl, formData)
            .then(res => res)
            .then(data => {
                if (data) {           
                  hentSkatteprosentData();       
                  nydata ? setResponseMessage("Skatteprosenten er lagret.") : setResponseMessage("Skatteprosenten er oppdatert.");
                }
                else {
                  setResponseMessage("Feilet ved lagring av skatteprosent");
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
            setSkatteprosentRows((prevData) => prevData.filter((item) => item.id !== id));
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettSkatteprosent?id=" + id)
            .then(res => res)
            .then(data => {
                if(!data) {
                    setResponseMessage("Sletting feilet");
                }
            });     
        }
    }

    const leggTilNySkatteprosentRad = () => {
        const newItem = {
            id: -1,
            aar: '',
            skatteprosent: 0,
            newrow: true
        };
        setSkatteprosentRows(prevData => [...prevData, newItem]);
    };

    function handleSkatteprosentChange(id,event) {
        const newValue = event.target.value;
        setSkatteprosentRows((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, skatteprosent: newValue } : item
          )
        );
    }

    function handleAarChange(id,event) {
        const newValue = event.target.value;
        setSkatteprosentRows((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, aar: newValue } : item
          )
        );
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
            <Back/>
            <h1>Administrasjon av skatteprosent</h1>
                
            {skatteprosentRows.length > 0 ? (
    
              <form>      
                <table id="table-presentation">
                    <thead>
                            <tr>
                                <th>År</th>
                                <th>Skatteprosent (%)</th>
                                <th>Konfigurasjon</th>
                            </tr>
                            </thead>
                     <tbody>
                        {skatteprosentRows.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {item.aar === '' ?  
                                    <DatePicker
                                      selected={dato}
                                      onChange={(date) => setDato(date)}
                                      showYearPicker
                                      dateFormat="yyyy"
                                    />
                                : item.aar}
                              </td>
                              <td><input type="number" value={item.skatteprosent} onChange={(event) => handleSkatteprosentChange(item.id, event)}/></td>
                              <td>
                                    {item.newrow
                                    ? <button className="button-space" onClick={handleSubmit(-1, null, item.skatteprosent, true)}>Lagre</button>
                                    : <button className="button-space" onClick={handleSubmit(item.id, item.aar, item.skatteprosent, false)}>Oppdater</button>
                                    }
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
             
             {visLeggTilNyRadKnapp && <button type="button" onClick={leggTilNySkatteprosentRad}>Legg til ny skatteprosent</button>}
    
                {responseMessage && <p>{responseMessage}</p>} 
            </>
          );
}