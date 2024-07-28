// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, getUrlWithParamData } from './../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';

export function Inntektregnskap() {
   const [leilighetRows, setLeilighetRows] = useState({});

   const [leilighetId, setleilighetId] = useState('');
   const [dato, setDato] = useState(null);

   const [inntektData, setInntektData] = useState({});

   const [loading, setLoading] = useState(true);

    useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);          
            });
           

          if (leilighetId != null && dato != null) {
            const aar = dato.getFullYear();
            const formData = { leilighetId, aar };
            setLoading(true);

            fetchData(config.zInvestBackendUrl + 'search/hentInntektRegnskap' + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setInntektData(data);
                  setLoading(false);          
              });  
          }
    }, [leilighetId, dato]);

    const handleLeilighetIdChange = event => {
            setleilighetId(event.target.value);
        };


    const columns = [
      { key: 'label', name: 'Label', minWidth: '20%' },
      { key: 'belop', name: 'Beløp', minWidth: '80%' },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }    

    const lineUnder = (label) => {
      return label === "" ? "line-under" : "";
    }

    return (
     <>
        <Back/>
        <h1>Inntekt regnskap</h1>
        <h3>Leilighet</h3>
                        <select value={leilighetId} onChange={handleLeilighetIdChange}>
                              <option key="">Velg leilighet</option>
                              {leilighetRows.map(row => (
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

            <table className='striped-table'>
                 <tbody>
                    {inntektData.map((item) => (
                        <tr className={lineUnder(item.label)} key={item.id}>
                          <td>{item.label}</td>
                          <td>{item.belop}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         ) : (
             <p/>
         )}

        </>
      );

}