import React, { useState, useEffect } from 'react';
import { fetchData, fetchParamData } from './../utils/dataUtil.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDataGrid from 'react-data-grid';

function Inntektregnskap() {
   const [leilighetRows, setLeilighetRows] = useState([]);

   const [leilighetId, setleilighetId] = useState('');
   const [dato, setDato] = useState(null);

   const [inntektData, setInntektData] = useState({});

    useEffect(() => {
          fetchData('/hentLeiligheter')
            .then(res => res.json())
            .then(data => setLeilighetRows(data));

          if (leilighetId != null && dato != null) {
            const aar = dato.getFullYear();
            const data = { leilighetId, aar };
            fetchParamData('/hentInntektRegnskap', data)
                .then(res => res.json())
                .then(data => setInntektData(data));
          }
    }, [leilighetId, dato]);

    const handleLeilighetIdChange = event => {
            setleilighetId(event.target.value);
        };


    const columns = [
      { key: 'label', name: 'Label', minWidth: '50%' },
      { key: 'belop', name: 'Beløp', minWidth: '50%' },
    ];

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
           <div style={{ padding: '20px 0 0 0' }}>
                <ReactDataGrid className="gridStyle"
                    columns={columns}
                    rows={inntektData}
                    rowsCount={inntektData.length}
                  />
            </div>
         ) : (
             <p/>
         )}

        </>
      );

    }

export default Inntektregnskap;