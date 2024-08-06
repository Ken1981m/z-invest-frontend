// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Back } from './Back';
import { config } from '../config/config';
import { fetchData, postRequestOnUrl } from '../services/dataUtil';
import { useNavigate } from 'react-router-dom';

export function InntektTypeAdmin() {
    const navigate = useNavigate();

    const [inntektTypeRows, setInntektTypeRows] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(config.zInvestBackendUrl + 'search/hentInntektTyper')
            .then(res => res)
              .then(data => {
                setInntektTypeRows(data);
                setLoading(false);  
              });            
  
    }, []);

    const handleRediger = (item) => {
        navigate('/editInntektType', 
            { state: 
                { 
                    item
                         
            } }
        );
    }

    const handleSlett = (id) => {
        var result = confirm("Vil du virkelig slette denne raden?");
        if (result) {
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettInntektType?id=" + id)
            .then(res => res)
            .then(data => {
                window.location.reload();  
            });     
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }   

    return (
        <>
            <Back />

            {inntektTypeRows.length > 0 && (
                
                <div>
                    <table id="table-presentation">
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Beskrivelse</th>
                                <th>Konfigurasjon</th>
                            </tr>
                        </thead>
                        <tbody>
                        {inntektTypeRows.map((item) => (
                            <tr key={item.id}>
                            <td>{item.navn}</td>
                            <td>{item.beskrivelse}</td>
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