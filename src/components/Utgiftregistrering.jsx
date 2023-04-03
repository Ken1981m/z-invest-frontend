import React, { useState, useEffect } from 'react';
import { postParamData, fetchData } from './../utils/dataUtil.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Utgiftregistrering() {
    const [leilighetRows, setLeilighetRows] = useState([]);
    const [utgiftTypeRows, setUtgiftTypeRows] = useState([]);

    const [leilighetId, setleilighetId] = useState('');
    const [utgiftTypeId, setUtgiftTypeId] = useState('');
    const [dato, setDato] = useState(null);
    const [belop, setBelop] = useState('');


    useEffect(() => {
      fetchData('/hentLeiligheter')
        .then(res => res.json())
        .then(data => setLeilighetRows(data));

      fetchData('/hentUtgiftTyper')
        .then(res => res.json())
        .then(data => setUtgiftTypeRows(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatertDato = dato != null ? formatDate(dato) : null;
        const data = { leilighetId, utgiftTypeId, formatertDato, belop };
        // transfer jsonData to backend REST controller method
        postParamData('/leggTilUtgift', data);
    };

    const handleLeilighetIdChange = event => {
        setleilighetId(event.target.value);
    };

    const handleUtgiftTypeIdChange = event => {
        setUtgiftTypeId(event.target.value);
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

                <h2>Utgift type</h2>
                <select value={utgiftTypeId} onChange={handleUtgiftTypeIdChange}>
                     <option key="">Velg utgift type</option>
                      {utgiftTypeRows.map(row => (
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

export default Utgiftregistrering;