import React, { useState, useEffect } from 'react';
import { fetchData, fetchParamData } from './../utils/dataUtil.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function Inntektregnskap() {
   const [leilighetRows, setLeilighetRows] = useState([]);

   const [leilighetId, setleilighetId] = useState('');
   const [dato, setDato] = useState(null);

   const [inntektData, setInntektData] = useState([]);

    useEffect(() => {
          fetchData('/hentLeiligheter')
            .then(res => res.json())
            .then(data => setLeilighetRows(data));

          if (leilighetId != null && dato != null) {
            const aar = dato.getFullYear();
            const data = { leilighetId, aar };
            fetchParamData('/hentInntekt', data)
                .then(res => res.json())
                .then(data => setInntektData(data));
          }
    }, [leilighetId, dato]);

    const handleLeilighetIdChange = event => {
            setleilighetId(event.target.value);
        };

    return (
     <>
        <h2>Leilighet</h2>
                        <select value={leilighetId} onChange={handleLeilighetIdChange}>
                              <option key="">Velg leilighet</option>
                              {leilighetRows.map(row => (
                                <option key={row.id} value={row.id}>{row.navn}</option>
                              ))}
                        </select>
        <h2>År</h2>
                <DatePicker
                     selected={dato}
                     onChange={dato => setDato(dato)}
                     dateFormat="yyyy"
                     showYearPicker
                />

        {inntektData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {inntektData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'white-row' : 'grey-row'}>
                    <td>{row.mnd}</td>
                    <td>{row.belop}</td>
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

export default Inntektregnskap;