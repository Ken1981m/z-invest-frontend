import React, { useState, useEffect } from 'react';
import { postParamData, fetchData } from './../utils/dataUtil.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Inntektregistrering() {
    const [leilighetRows, setLeilighetRows] = useState([]);
    const [inntektTypeRows, setInntektTypeRows] = useState([]);

    const [leilighetId, setleilighetId] = useState('');
    const [inntektTypeId, setInntektTypeId] = useState('');
    const [dato, setDato] = useState(null);
    const [belop, setBelop] = useState('');


    useEffect(() => {
      fetchData('/hentLeiligheter')
        .then(res => res.json())
        .then(data => setLeilighetRows(data));

      fetchData('/hentInntektTyper')
        .then(res => res.json())
        .then(data => setInntektTypeRows(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const data = { leilighetId, inntektTypeId, formatertDato, belop };
        // transfer jsonData to backend REST controller method
        postParamData('/leggTilInntekt', data);
    };

    const handleLeilighetIdChange = event => {
        setleilighetId(event.target.value);
    };

    const handleInntektTypeIdChange = event => {
        setInntektTypeId(event.target.value);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${month}-${year}`;
    }

    function handleBelopChange(event) {
        setBelop(event.target.value);
      }

    return (
        <div>
            <h1>Registrer ny inntekt</h1>

            <form onSubmit={handleSubmit}>

                <h2>Leilighet</h2>
                <select value={leilighetId} onChange={handleLeilighetIdChange}>
                      <option key="">Velg leilighet</option>
                      {leilighetRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>

                <h2>Inntekt type</h2>
                <select value={inntektTypeId} onChange={handleInntektTypeIdChange}>
                     <option key="">Velg inntekt type</option>
                      {inntektTypeRows.map(row => (
                        <option key={row.id} value={row.id}>{row.navn}</option>
                      ))}
                </select>

                <h2>Dato</h2>
                <DatePicker
                     selected={dato}
                     onChange={date => setDato(date)}
                     dateFormat="MM/yyyy"
                     showMonthYearPicker
                />

                <h2>Beløp</h2>
                <input type="number" value={belop} onChange={handleBelopChange}/>

                <div>
                <button className="button-space" onClick={handleSubmit}>Lagre</button>
                </div>
            </form>
        </div>

    );
}

export default Inntektregistrering;