// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate, getUrlWithParamData, postFormDataRequestOnUrl, postRequestOnUrl } from './../services/dataUtil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { useNavigate } from 'react-router-dom';
import { hentMaaned } from '../services/maanedUtil';
import { ClipLoader } from 'react-spinners';

export function UtgiftAdmin() {
   const navigate = useNavigate();

   const [leilighetRows, setLeilighetRows] = useState({});
   const [utgiftTypeRows, setUtgiftTypeRows] = useState([]);

   const [leilighetId, setLeilighetId] = useState('');
   const [utgiftTypeId, setUtgiftTypeId] = useState('');
   const [dato, setDato] = useState(null);
   const [belop, setBelop] = useState('');
   const [beskrivelse, setBeskrivelse] = useState('');

   const [utgiftData, setUtgiftData] = useState({});

   const [loading, setLoading] = useState(true);
   const [responseMessage, setResponseMessage] = useState('');

   const [nydato, setNydato] = useState(null);
   const [visLeggTilNyRadKnapp, setVisLeggTilNyRadKnapp] = useState(false);

   function hentUtgiftData() {
      const aar = dato.getFullYear();
      const formData = { leilighetId, utgiftTypeId, aar };
      
      fetchData(config.zInvestBackendUrl + 'search/hentUtgift' + getUrlWithParamData(formData))
              .then(res => res)
                .then(data => {
                    setUtgiftData(data);
                    setLoading(false);          
                });  
   }

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

          if ((leilighetId != null && leilighetId != '') && 
              (utgiftTypeId != null && utgiftTypeId != '') &&
               dato != null) {
            setVisLeggTilNyRadKnapp(true);
            setResponseMessage('');

           
            setLoading(true);

            hentUtgiftData();
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

    function handleUtgiftBeskrivelseChange(id,event) {
      const newValue = event.target.value;
        setUtgiftData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, utgiftBeskrivelse: newValue } : item
          )
        );
    }
    
    const handleSubmit = (id, mndValg, belop, beskrivelse, label, nydata) => (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const mnd = mndValg === 'ikkevalgt' ? 13 : mndValg;
        const formData = { id, leilighetId, utgiftTypeId, formatertDato, mnd, belop, beskrivelse };

        const backendUrl = nydata 
        ? config.zInvestBackendUrl + "persist/leggTilUtgift" 
        : config.zInvestBackendUrl + "persist/oppdaterUtgift"

        try {
            postFormDataRequestOnUrl(backendUrl, formData)
            .then(res => res)
            .then(data => {
                if (data) {
                  hentUtgiftData();
                  nydata ? setResponseMessage("Utgiften er lagret.") : setResponseMessage("Utgiften er oppdatert.");
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

    const leggTilNyUtgiftRad = () => {
      const newItem = {
          id: -1,
          label: 'ny',
          belop: 0,
          mnd: 'ikkevalgt',
          mndUavhengig: false,
          newrow: true
      };
      setUtgiftData(prevData => [...prevData, newItem]);
  };

  const setItemMnd = (nyitem, date) => {
      setUtgiftData((prevData) =>
        prevData.map((item) =>
          item.id === nyitem.id 
          ? { ...item, 
            id: hentMaaned(date.getMonth() + 1),
            mnd: date.getMonth() + 1, 
            label: hentMaaned(date.getMonth() + 1),
             } 
          : item
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
        <h1>Administrasjon av utgifter</h1>
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
                     minDate={new Date(2019,0,1)}
                     dateFormat="yyyy"
                     showYearPicker
                />

        {utgiftData.length > 0 ? (

          <form>      
            <table id="table-presentation">
                <thead>
                        <tr>
                            <th>Måned</th>
                            <th>Beløp</th>
                            <th>Kommentar</th>
                            <th>Konfigurasjon</th>
                        </tr>
                        </thead>
                 <tbody>
                    {utgiftData.map((item) => (
                        <tr key={item.id}>
                          <td> 
                            {item.label === 'ny' 
                            ?  (!item.mndUavhengig ? 
                                  <DatePicker
                                        selected={nydato}
                                        onChange={date => setItemMnd(item, date)}
                                        minDate={new Date(dato.getFullYear(), 0, 1)}
                                        maxDate={ new Date(dato.getFullYear(), 11, 31)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                  />
                                  : 'Måneduavhengig'
                               )
                            : item.mndUavhengig ? 'Måneduavhengig' : item.label
                            
                            }
                      </td>
                          <td><input type="number" value={item.belop} onChange={(event) => handleBelopChange(item.id, event)}/></td>
                          <td><textarea className="wide-textarea" type="text" value={item.utgiftBeskrivelse} onChange={(event) => handleUtgiftBeskrivelseChange(item.id, event)} /></td>
                          <td>
                                {item.newrow
                                ? <button className="button-space" onClick={handleSubmit(-1, item.mnd, item.belop, item.utgiftBeskrivelse, item.label, true)}>Lagre</button>
                                : <button className="button-space" onClick={handleSubmit(item.id, item.mnd, item.belop, item.utgiftBeskrivelse, item.label, false)}>Oppdater</button>
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
         
         {visLeggTilNyRadKnapp && <button type="button" onClick={leggTilNyUtgiftRad}>Legg til ny utgift</button>}

            {responseMessage && <p>{responseMessage}</p>} 
        </>
      );

}