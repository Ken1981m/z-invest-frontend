// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { fetchData } from './../services/dataUtil';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../config/config.js';
import { Back } from './Back.js';
import { ClipLoader } from 'react-spinners';
import {InntektAdmin} from "./InntektAdmin.tsx";
import {UtgiftAdmin} from "./UtgiftAdmin.tsx";

export function InntektUtgiftAdmin() {

    const [leilighetRows, setLeilighetRows] = useState({});
    const [leilighetId, setLeilighetId] = useState('');
    const [regnskapType, setRegnskapType] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(config.zInvestBackendUrl + 'search/hentLeiligheter')
            .then(res => res)
            .then(data => {
                setLeilighetRows(data);
                setLoading(false);
            });
    }, [leilighetId]);

    const handleLeilighetIdChange = event => {
        setLeilighetId(event.target.value);
    };

    const handleRegnskapTypeChange = event => {
        setRegnskapType(event.target.value);
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
            <h1>Administrasjon av inntekter og utgifter</h1>
            <h3>Leilighet</h3>
            <select value={leilighetId} onChange={handleLeilighetIdChange}>
                <option key="">Velg leilighet</option>
                {leilighetRows.map(row => (
                    <option key={row.id} value={row.id}>{row.navn}</option>
                ))}
            </select>

            <h3>Regnskap type</h3>
            <select value={regnskapType} onChange={handleRegnskapTypeChange}>
                <option key="">Velg regnskap type</option>
                <option key="inntekter">INNTEKTER</option>
                <option key="utgifter">UTGIFTER</option>
            </select>

            {regnskapType === 'INNTEKTER' && (
                <InntektAdmin leilighetId={leilighetId} />
            )}

            {regnskapType === 'UTGIFTER' && (
                <UtgiftAdmin leilighetId={leilighetId} />
            )}
        </>
    );

}