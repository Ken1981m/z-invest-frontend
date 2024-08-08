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
   const [tilDato, setTilDato] = useState(null);

   const [inntektData, setInntektData] = useState({});

   const [loading, setLoading] = useState(true);

   function genererAarListe(fraAaar, tilAar) {
      const aarListe = [];
    
      for (let aar = fraAaar; aar <= tilAar; aar++) {
        aarListe.push(aar);
      }
      
      return aarListe.join(';');
   }

   function getAarArray(fraAaar, tilAar) {
    const aarArray = [];
  
    for (let aar = fraAaar; aar <= tilAar; aar++) {
      aarArray.push(aar);
    }
  
    return aarArray;
  }

    useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);          
            });
           

          if (leilighetId != null && dato != null && tilDato != null) {
            const aar = genererAarListe(dato.getFullYear(), tilDato.getFullYear());
            const url = "search/hentInntektRegnskapForFlereAar";

            const formData = { leilighetId, aar };
            
            setLoading(true);

            fetchData(config.zInvestBackendUrl + url + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setInntektData(data);
                  setLoading(false);          
              });  
          }
    }, [leilighetId, dato, tilDato]);

    const handleLeilighetIdChange = event => {
            setleilighetId(event.target.value);
        };


    // const columns = [
    //   { key: 'label', name: 'Label', minWidth: '20%' },
    //   { key: 'belop', name: 'Beløp', minWidth: '80%' },
    // ];

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
                              <option key="-1">Velg leilighet</option>
                              {leilighetRows.map(row => (
                                <option key={row.id} value={row.id}>{row.navn}</option>
                              ))}
                        </select>
        <h3>Fra år</h3>
                <DatePicker
                     selected={dato}
                     onChange={dato => setDato(dato)}
                     dateFormat="yyyy"
                     showYearPicker
                />

          <h3>Til år</h3>
          <DatePicker
               selected={tilDato}
               onChange={dato => setTilDato(dato)}
               dateFormat="yyyy"
               showYearPicker
          />


        {inntektData.length > 0 ? (

          <table className='striped-table'>
              <tbody>
                <tr>
                  <td/>
                  {inntektData.map((item) => (
                      item.aar !== null 
                      ? <td><b>{item.aar}</b></td> 
                      : ""                
                  ))}                  
                </tr>
                  
                {inntektData.map((item, index) => (
                  item.aar === null ? (
                      <tr className={lineUnder(item.label)} key={item.id}>
                          {item.label !== "" && (
                              <>
                                <td key={index}>{item.label}</td>
                                {item.belopList.map((belop, index2) => (
                                  <td key={index2}>{belop}</td>
                                ))}
                              </>
                          )}
                      </tr>
                  ) : ""
                  ))}
              </tbody>
          </table>
        ) : (
        <p/>
        )} 


        </>
      );

}