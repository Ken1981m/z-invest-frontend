// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {fetchData, genererListeAvFraTilParams, getUrlWithParamData} from '../services/dataUtil.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { ClipLoader } from 'react-spinners';
import UtgiftModal from './UtgiftModal.js';
import LeilighetValg from './LeilighetValg.js';
import {MonthSelect} from "./MaanedDropdown.tsx";

export function Regnskap() {
   const [leilighetRows, setLeilighetRows] = useState({});

   const [leilighetIds, setLeilighetIds] = useState([]);
   const [dato, setDato] = useState(null);
   const [tilDato, setTilDato] = useState(null);

   const [inntektData, setInntektData] = useState({});
   const [utgiftData, setUtgiftData] = useState({});  
   const [utgiftDataAar, setUtgiftDataAar] = useState('');

   const [loading, setLoading] = useState(true);
   const [inntektLoading, setInntektLoading] = useState(false);

   const [isModalOpen, setIsModalOpen] = useState(false);

   const [visMaanedValg, setVisMaanedValg] = useState(false);
   const [fraMaaned, setFraMaaned] = useState("");
   const [tilMaaned, setTilMaaned] = useState("");

   function visUtgiftDetaljer(aar: string) {
        setUtgiftDataAar(aar);

       const mndListe = visMaanedValg ? `${fraMaaned};${tilMaaned}` : `1;12`;

        const formData = { leilighetIds, aar, mndListe};

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

  }, []);

    useEffect(() => {
        const maanedValgErOk = !visMaanedValg  ? true : fraMaaned !== "" && tilMaaned !== "";

        if (leilighetIds != null && leilighetIds.length > 0 && dato != null && tilDato != null && maanedValgErOk) {

            if (visMaanedValg && dato.getFullYear() !== tilDato.getFullYear()) {
                alert("Fra og til år må være lik, dersom månedvalg aktiveres");
                return;
            }

            const aarliste = genererListeAvFraTilParams(dato.getFullYear(), tilDato.getFullYear());
            const mndListe = visMaanedValg ? `${fraMaaned};${tilMaaned}` : `1;12`;
            const url = "search/hentInntektRegnskap";

            const formData = { leilighetIds, aarliste, mndListe };

            setInntektLoading(true);

            fetchData(config.zInvestBackendUrl + url + getUrlWithParamData(formData))
            .then(res => res)
              .then(data => {
                  setInntektData(data);
                  setInntektLoading(false);
              });
          }
    }, [leilighetIds, dato, tilDato, fraMaaned, tilMaaned]);

    function handleLeilighetIdChange(valgteLeilighetId: string, checked: boolean) {
      setLeilighetIds((prevIds) => {
        if (checked) {
            return [...prevIds, valgteLeilighetId];
        } else {
            return prevIds.filter(id => id !== valgteLeilighetId);
        }
      });
    };

    if (loading) {
        return (
        <div className="spinner-container">
            <ClipLoader />
        <div>Loading...</div>
        </div>
        );
    }    

    const lineUnder = (label) => {
      return label === "" ? "line-under" : "";
    }

    const handleVisMaanedValgChange = event => {
        setVisMaanedValg(event.target.checked ? true : false);
    };


    return (
     <>
        <Back/>
        <h1>Regnskap oversikt</h1>
        <h3>Kryss av leilighetene du ønsker å se regnskap for:</h3>
        <LeilighetValg leilighetRows={leilighetRows} handleLeilighetIdChange={handleLeilighetIdChange}/>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
           <h4>Aktiver månedvalg:</h4>
           <input
               type="checkbox"
               checked={visMaanedValg}
               onChange={handleVisMaanedValgChange}
           />
        </div>

        <h3>Fra år</h3>
        <DatePicker
              selected={dato}
              onChange={dato => setDato(dato)}
              minDate={new Date(2019,0,1)}
              dateFormat="yyyy"
              showYearPicker
        />

        <h3>Til år</h3>
        <DatePicker
              selected={tilDato}
              onChange={dato => setTilDato(dato)}
              minDate={new Date(2019,0,1)}
              dateFormat="yyyy"
              showYearPicker
        />

         {visMaanedValg && (
             <>
                 <h3>Fra måned</h3>
                 <MonthSelect value={fraMaaned} onChange={setFraMaaned} />

                 <h3>Til måned</h3>
                 <MonthSelect value={tilMaaned} onChange={setTilMaaned} />
             </>
         )}

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
                                                {Intl.NumberFormat('fr-FR').format(belop)}
                                              </a>
                                            : Intl.NumberFormat('fr-FR').format(belop)
                                          }
                                      </td>
                                    ))}
                                  </>

                              )}
                              {item.label === "" && (
                                <>
                                <td/>
                                {inntektData.map((item, index) => (
                                    item.aar !== null 
                                    ? <td/> 
                                    : ""                
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