// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Back } from "./Back";
import { ClipLoader } from "react-spinners";
import { config } from "../config/config";
import { fetchData, postFormDataRequestOnUrl, postRequestOnUrl } from "../services/dataUtil";
import DatePicker from "react-datepicker";

export function FaktiskBetaltSkatt() {

    const [grupperingBaser, setGrupperingBaser] = useState({});
    const [grupperingLeiligheter, setGrupperingLeiligheter] = useState({});
    const [faktiskBetaltSkattRows, setFaktiskBetaltSkattRows] = useState([]);
    const [dato, setDato] = useState(null);


    const [grupperingId, setGrupperingId] = useState('');

    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const [visLeggTilNyRadKnapp, setVisLeggTilNyRadKnapp] = useState(false);


    function hentFaktiskBetaltSkatt(grupperingId: string) {
        fetchData(config.zInvestBackendUrl + 'search/hentFaktiskBetaltSkatt?grupperingId=' + grupperingId)
            .then(res => res)
              .then(data => {
                setFaktiskBetaltSkattRows(data);
                setLoading(false);        
                setVisLeggTilNyRadKnapp(true);  
              });  
    }


    useEffect(() => {
        fetchData(config.zInvestBackendUrl + 'search/hentGrupperingBaser')
          .then(res => res)
            .then(data => {
                setGrupperingBaser(data);
                setLoading(false);          
            });

         if (grupperingId != null && grupperingId != '') {
            fetchData(config.zInvestBackendUrl + 'search/hentGrupperingLeilighet?grupperingId=' + grupperingId)
            .then(res => res)
              .then(data => {
                 setGrupperingLeiligheter(data);
                 setLoading(false);          
              });  

              hentFaktiskBetaltSkatt(grupperingId);
         }
    
    }, [grupperingId]);

    const leggTilNyFaktiskBetaltSkattRad = () => {
        const newItem = {
            id: -1,
            aar: '',
            faktiskSkattBelopForUtleieUtfyltISkattemelding: 0,
            faktiskSkattBelopEtterUtleieUtfyltISkattemelding: 0,
            newrow: true
        };
        setFaktiskBetaltSkattRows(prevData => [...prevData, newItem]);
    };


    const handleGrupperingIdChange = event => {
        setGrupperingId(event.target.value);
    };

    function handleSkattForChange(id,event) {
        const newValue = event.target.value;
        setFaktiskBetaltSkattRows((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, faktiskSkattBelopForUtleieUtfyltISkattemelding: newValue } : item
          )
        );
    };

    function handleSkattEtterChange(id,event) {
        const newValue = event.target.value;
        setFaktiskBetaltSkattRows((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, faktiskSkattBelopEtterUtleieUtfyltISkattemelding: newValue } : item
          )
        );
    };

    const handleSubmit = (hentetAar, faktiskSkattBelopForUtleieUtfyltISkattemelding, faktiskSkattBelopEtterUtleieUtfyltISkattemelding, nydata) => (e) => {
        e.preventDefault();
        const aar = dato !== null ? dato.getFullYear() : hentetAar;

        const formData = { grupperingId, aar, faktiskSkattBelopForUtleieUtfyltISkattemelding, faktiskSkattBelopEtterUtleieUtfyltISkattemelding };

        const backendUrl = nydata 
        ? config.zInvestBackendUrl + "persist/leggTilFaktiskBetaltSkatt" 
        : config.zInvestBackendUrl + "persist/oppdaterFaktiskBetaltSkatt"

        try {
            postFormDataRequestOnUrl(backendUrl, formData)
            .then(res => res)
            .then(data => {
                if (data) {
                  hentFaktiskBetaltSkatt(grupperingId);
                  nydata ? setResponseMessage("Faktisk skatt er lagret.") : setResponseMessage("Faktisk skatt er oppdatert.");
                }
                else {
                  setResponseMessage("Feilet ved lagring av faktisk skatt");
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
            setFaktiskBetaltSkattRows((prevData) => prevData.filter((item) => item.id !== id));
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettFaktiskBetaltSkatt?id=" + id)
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
           <h1>Administrasjon av faktisk betalt skatt</h1>

           <h3>Grupperingsnavn</h3>
                <select value={grupperingId} onChange={handleGrupperingIdChange}>
                    <option key="">Velg gruppering</option>
                        {grupperingBaser.map(row => (
                            <option key={row.id} value={row.id}>{row.grupperingNavn}</option>
                        ))}
                </select>

                            

            {grupperingLeiligheter.length > 0 && faktiskBetaltSkattRows.length > 0 ? (     
                <>
                <p>
                    <b>Grupperte leiligheter</b>:
                    {grupperingLeiligheter.map((item) => item.leilighetNavn).join(', ')}
                </p>

                <form>      
            <table id="table-presentation">
                <thead>
                        <tr>
                            <th>År</th>
                            <th>Faktisk betalt skatt før utleie regnskap lagt til i skattemelding</th>
                            <th>Faktisk betalt skatt etter utleie regnskap lagt til i skattemelding</th>
                            <th>Konfigurasjon</th>
                        </tr>
                        </thead>
                 <tbody>
                    {faktiskBetaltSkattRows.map((item) => (
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
                          <td><input type="number" value={item.faktiskSkattBelopForUtleieUtfyltISkattemelding} onChange={(event) => handleSkattForChange(item.id, event)}/></td>
                          <td><input type="number" value={item.faktiskSkattBelopEtterUtleieUtfyltISkattemelding} onChange={(event) => handleSkattEtterChange(item.id, event)}/></td>
                          <td>
                                {item.id === -1 || item.newrow
                                ? <button className="button-space" onClick={handleSubmit(item.aar, item.faktiskSkattBelopForUtleieUtfyltISkattemelding, 
                                    item.faktiskSkattBelopEtterUtleieUtfyltISkattemelding, true)}>Lagre</button>
                                : <button className="button-space" onClick={handleSubmit(item.aar, item.faktiskSkattBelopForUtleieUtfyltISkattemelding,
                                     item.faktiskSkattBelopEtterUtleieUtfyltISkattemelding, false)}>Oppdater</button>
                                }
                                <button className="button-space" onClick={() => handleSlett(item.id)}>Slett</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </form>    

                </>
            ) : (
                <p/>
            )}

            {visLeggTilNyRadKnapp && <button type="button" onClick={leggTilNyFaktiskBetaltSkattRad}>Legg til ny rad</button>}
    
             {responseMessage && <p>{responseMessage}</p>} 

        </>
           
    );
}