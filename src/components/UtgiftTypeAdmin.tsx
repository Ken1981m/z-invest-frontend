// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Back } from './Back';
import { config } from '../config/config';
import { fetchData, postRequestOnUrl } from '../services/dataUtil';
import { useNavigate } from 'react-router-dom';

export function UtgiftTypeAdmin() {
    const navigate = useNavigate();

    const [utgiftTypeRows, setUtgiftTypeRows] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(config.zInvestBackendUrl + 'search/hentUtgiftTyper')
            .then(res => res)
              .then(data => {
                setUtgiftTypeRows(data);
                setLoading(false);  
              });            
  
    }, []);

    const handleRediger = (item) => {
        navigate('/editUtgiftType', 
            { state: 
                { 
                    item
                         
            } }
        );
    }

    const handleSlett = (id) => {
        var result = confirm("Vil du virkelig slette denne raden?");
        if (result) {
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettUtgiftType?id=" + id)
            .then(res => res)
            .then(data => {
                window.location.reload();  
            });     
        }
    }


    return (
        <>
            <Back />

            {utgiftTypeRows.length > 0 && (
                
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Beskrivelse</th>
                            <th>Måned uavhengig</th>
                            <th>Konfigurasjon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {utgiftTypeRows.map((item) => (
                            <tr key={item.id}>
                            <td>{item.navn}</td>
                            <td>{item.beskrivelse}</td>
                            <td>{item.mndUavhengig ? 'Ja' : 'Nei'}</td>
                            <td>
                                <button onClick={() => handleRediger(item)}>Rediger</button>
                                <button onClick={() => handleSlett(item.id)}>Slett</button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        
        </>
    )
}