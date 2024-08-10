// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData, getUrlWithParamData } from '../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { ClipLoader } from 'react-spinners';
import UtgiftModal from './UtgiftModal.js';

export function Regnskap() {
   const [leilighetRows, setLeilighetRows] = useState({});

   const [leilighetId, setleilighetId] = useState('');
   const [dato, setDato] = useState(null);
   const [tilDato, setTilDato] = useState(null);

   const [inntektData, setInntektData] = useState({});
   const [utgiftData, setUtgiftData] = useState({});  
   const [utgiftDataAar, setUtgiftDataAar] = useState('');

   const [loading, setLoading] = useState(true);
   const [inntektLoading, setInntektLoading] = useState(false);

   const [isModalOpen, setIsModalOpen] = useState(false);

   function genererAarListe(fraAaar, tilAar) {
      const aarListe = [];
    
      for (let aar = fraAaar; aar <= tilAar; aar++) {
        aarListe.push(aar);
      }
      
      return aarListe.join(';');
   }


  function visUtgiftDetaljer(aar: string) {
    setUtgiftDataAar(aar);

    const formData = { leilighetId, aar };

    fetchData(config.zInvestBackendUrl + 'search/hentUtgiftRegnskap' + getUrlWithParamData(formData))
          .then(res => res)
            .then(data => {
                setUtgiftData(data)
            });
  } 

  useEffect(() => {
    if (utgiftData && utgiftDataAar) {
      setIsModalOpen(true);
    }
  }, [utgiftData]);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
          fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
          .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);          
            });
           

          if (leilighetId != null && dato != null && tilDato != null) {
            const aarliste = genererAarListe(dato.getFullYear(), tilDato.getFullYear());
            const url = "search/hentInntektRegnskap";

            const formData = { leilighetId, aarliste };
            
            setInntektLoading(true);

            fetchData(config.zInvestBackendUrl + url + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setInntektData(data);
                  setInntektLoading(false);          
              });  
          }
    }, [leilighetId, dato, tilDato]);

    const handleLeilighetIdChange = event => {
            setleilighetId(event.target.value);
        };

    if (loading) {
        return <div>Loading...</div>;
    }    

    const lineUnder = (label) => {
      return label === "" ? "line-under" : "";
    }

    return (
     <>
        <Back/>
        <h1>Regnskap oversikt</h1>
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

        {inntektLoading ?
          <div className="spinner-container">
            <ClipLoader />
            <p>Loading...</p>
          </div>
        : (                    
          <>
            {inntektData.length > 0 ? (

              <table className='striped-table'>
                  <tbody>
                    <tr>
                      <td/>
                      {inntektData.map((item, index) => (
                          item.aar !== null 
                          ? <td key={index}><b>{item.aar}</b></td> 
                          : ""                
                      ))}                  
                    </tr>
                      
                    {inntektData.map((item, index) => (
                      item.aar === null ? (
                          <tr className={lineUnder(item.label)} key={index}>
                              {item.label !== "" && (
                                  <>
                                    <td key={index}>
                                      {item.label}                                      
                                    </td>
                                    
                                    {item.belopList.map((belop, index) => (
                                      <td key={index}>
                                          {item.label === "Sum utgifter" 
                                            ? <a href="#" onClick={(e) => { e.preventDefault(); visUtgiftDetaljer(item.aarList[index]); }}>
                                                {belop}
                                              </a>
                                            : belop
                                          }
                                      </td>
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
        )}

         <UtgiftModal
              isOpen={isModalOpen}
              onClose={closeModal}
              utgiftData={utgiftData}
              aar={utgiftDataAar}
          />

        </>
      );

}