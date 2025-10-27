// @ts-nocheck
import React from 'react'
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
                <li>
                    <Link to="/inntektutgiftadmin">Administrer inntekter/utgifter</Link>
                </li>
              </ul>
            </td>
            <td className="align-top">
              <h3>KONFIGURASJON</h3>
              <ul className="rectangle">
                  <li>
                    <Link to="/leilighetadmin">Oversikt over leiligheter</Link>
                  </li>
                  <li>
                    <Link to="/leilighet">Registrer ny leilighet</Link>
                  </li>
                  <li>
                    <Link to="/skatteprosentadmin">Administrer skatteprosent</Link>
                  </li>
                  <li>
                    <Link to="/faktiskbetaltskattadmin">Administrer faktisk betalt skatt</Link>
                  </li>
                  <li>
                      <Link to="/inntekttypeadmin">Oversikt over inntekt type</Link>
                  </li>
                  <li>
                      <Link to="/inntekttyperegistrering">Registrer ny inntekt type</Link>
                  </li>
                  <li>
                      <Link to="/utgifttypeadmin">Oversikt over utgift type</Link>
                  </li>
                  <li>
                      <Link to="/utgifttyperegistrering">Registrer ny utgift type</Link>
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