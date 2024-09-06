// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData, postRequestOnUrl } from "../services/dataUtil";
import { config } from "../config/config";
import { Back } from "./Back";


export function LeilighetAdmin() {
    const navigate = useNavigate();

    const [leilighetRows, setLeilighetRows] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
        .then(res => res)
          .then(data => {
              setLeilighetRows(data);
              setLoading(false);          
          });
    }, []);

    const handleRediger = (item) => {
        navigate('/editLeilighet', 
            { state: 
                { 
                    item
                         
            } }
        );
    }

    const handleSlett = (id) => {
        var result = confirm("Vil du virkelig slette denne raden?");
        if (result) {
            postRequestOnUrl(config.zInvestBackendUrl + "persist/slettLeilighet?id=" + id)
            .then(res => res)
            .then(data => {
                window.location.reload();  
            });     
        }
    }

    return (
        <>
            <Back />
            {leilighetRows.length > 0 && (
                
                <div>
                    <table id="table-presentation">
                        <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Adresse</th>
                            <th>Postnr</th>
                            <th>Poststed</th>
                            <th>Beskrivelse</th>
                            <th>Konfigurasjon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leilighetRows.map((item) => (
                            <tr key={item.id}>
                            <td>{item.navn}</td>
                            <td>{item.adresse}</td>
                            <td>{item.postnr}</td>
                            <td>{item.poststed}</td>
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
