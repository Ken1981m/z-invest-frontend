// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export function Utleie() {
  return (
    <>
    <div id="mainpage-table-presentation">
    <div className="container">
      <h1>Z-Invest</h1>
      
      <table className="container">
        <tbody>
          <tr>
          <td className="align-top">
              <h3>REGNSKAP</h3>
              <ul className="rectangle">
                <li>
                    <Link to="/regnskap">Regnskap oversikt</Link>
                </li>
              </ul>
            </td>
            <td className="table-cell-inntekt align-top"> 
              <h3>INNTEKT</h3>
              <ul className="rectangle">
                  <li>
                    <Link to="/inntektadmin">Administrer registrerte inntekter</Link>
                  </li>
                  <li>
                    <Link to="/inntekttypeadmin">Oversikt over inntekt type</Link>
                  </li>                  
                  <li>
                      <Link to="/inntektregistrering">Registrer ny inntekt</Link>
                  </li>  
                  <li>
                    <Link to="/inntekttyperegistrering">Registrer ny inntekt type</Link>
                  </li>                
              </ul>
            </td>
            <td className="table-cell-utgift align-top">
              <h3>UTGIFT</h3>
              <ul className="rectangle">
                <li>
                  <Link to="/utgiftadmin">Administrer registrerte utgifter</Link>
                </li>
                <li>
                  <Link to="/utgifttypeadmin">Oversikt over utgift type</Link>
                </li>
                <li>
                  <Link to="/utgiftregistrering">Registrer ny utgift</Link>
                </li>
                <li>
                  <Link to="/utgifttyperegistrering">Registrer ny utgift type</Link>
                </li>
              </ul>
            </td>            
            <td className="align-top">
              <h3>KONFIGURASJON</h3>
              <ul className="rectangle">
                  <li>
                    <Link to="/leilighet">Registrer ny leilighet</Link>
                  </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>    
    </div>

    </>
  )
}