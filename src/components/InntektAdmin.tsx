// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate, getUrlWithParamData, postFormDataRequestOnUrl, postRequestOnUrl } from './../services/dataUtil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { hentMaaned } from '../services/maanedUtil';
import { ClipLoader } from 'react-spinners';

type InntektAdminProps = {
    leilighetId: string; // prop som skal sendes inn
};

export function InntektAdmin({ leilighetId }: InntektAdminProps) {
   const [inntektTypeRows, setInntektTypeRows] = useState([]);

   const [inntektTypeId, setInntektTypeId] = useState('');
   const [dato, setDato] = useState(null);

   const [inntektData, setInntektData] = useState({});

   const [loading, setLoading] = useState(false);
   const [responseMessage, setResponseMessage] = useState('');

   const [nydato, setNydato] = useState(null);
   const [visLeggTilNyRadKnapp, setVisLeggTilNyRadKnapp] = useState(false);

   function hentInntektData() {
      const aar = dato.getFullYear();
      const formData = { leilighetId, inntektTypeId, aar };

      fetchData(config.zInvestBackendUrl + 'search/hentInntekt' + getUrlWithParamData(formData))
        .then(res => res)
        .then(data => {
          setInntektData(data);
          setLoading(false);
        });
  }

   useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentInntektTyper')
            .then(res => res)
              .then(data => {
                setInntektTypeRows(data);
           });

          if ((leilighetId != null && leilighetId != '') && 
              (inntektTypeId != null && inntektTypeId != '') &&
               dato != null) {
            setVisLeggTilNyRadKnapp(true);
            setResponseMessage('');


            setLoading(true);

            hentInntektData();
          }
    }, [leilighetId, inntektTypeId, dato]);


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

    function handleBeskrivelseChange(id,event) {
      const newValue = event.target.value;
        setInntektData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, beskrivelse: newValue } : item
          )
        );
    }
    
    const handleSubmit = (mnd, belop, beskrivelse, label, nydata) => (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const formData = { leilighetId, inntektTypeId, formatertDato, mnd, belop, beskrivelse };

        const backendUrl = nydata 
        ? config.zInvestBackendUrl + "persist/leggTilInntekt" 
        : config.zInvestBackendUrl + "persist/oppdaterInntekt"

        try {
            postFormDataRequestOnUrl(backendUrl, formData)
            .then(res => res)
            .then(data => {
                if (data) {
                  hentInntektData();
                  nydata ? setResponseMessage("Inntekten er lagret.") : setResponseMessage("Inntekten er oppdatert.");
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
        const result = confirm("Vil du virkelig slette denne raden?");
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
        else {
          return;
        }
    }

    const leggTilNyInntektRad = () => {
      const newItem = {
          id: -1,
          label: 'ny',
          belop: 0,
          mnd: 'ny'
      };
      setInntektData(prevData => [...prevData, newItem]);
  };

  const setItemMnd = (nyitem, date) => {
      setInntektData((prevData) =>
        prevData.map((item) =>
          item.id === nyitem.id 
          ? { ...item, 
            id: hentMaaned(date.getMonth() + 1),
            mnd: date.getMonth() + 1, 
            label: hentMaaned(date.getMonth() + 1),
            newrow: true } 
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
                     minDate={new Date(2019,0,1)}
                     dateFormat="yyyy"
                     showYearPicker
                />

        {inntektData.length > 0 ? (

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
                    {inntektData.map((item) => (
                        <tr key={item.id}>
                          <td> 
                            {item.label === 'ny' ?  
                                  <DatePicker
                                        selected={nydato}
                                        onChange={date => setItemMnd(item, date)}
                                        minDate={new Date(dato.getFullYear(), 0, 1)}
                                        maxDate={ new Date(dato.getFullYear(), 11, 31)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                  />
                            : item.label}
                      </td>
                          <td><input type="number" value={item.belop} onChange={(event) => handleBelopChange(item.id, event)}/></td>
                          <td><textarea className="wide-textarea" type="text" value={item.beskrivelse} onChange={(event) => handleBeskrivelseChange(item.id, event)} /></td>
                          <td>
                                {item.id === -1 || item.newrow
                                ? <button className="button-space" onClick={handleSubmit(item.mnd, item.belop, item.beskrivelse, item.label, true)}>Lagre</button>
                                : <button className="button-space" onClick={handleSubmit(item.mnd, item.belop, item.beskrivelse, item.label, false)}>Oppdater</button>
                                }
                                <button className="button-space" onClick={() => handleSlett(item.id)}>Slett</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </form>
          
         ) : (
             <p/>
         )}
         
         {visLeggTilNyRadKnapp && <button type="button" onClick={leggTilNyInntektRad}>Legg til ny inntekt</button>}

            {responseMessage && <p>{responseMessage}</p>} 
        </>
      );

}