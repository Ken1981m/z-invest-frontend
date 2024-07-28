// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export function Utleie() {
  return (
    <>
    <div>
      <h1>Z-Invest</h1>
      <ul>
          <li>
             <Link to="/leilighet">Registrer ny leilighet</Link>
          </li>
      </ul>
      <ul>
          <li>
            <Link to="/inntekttyperegistrering">Registrer ny inntekt type</Link>
          </li>
          <li>
            <Link to="/inntekttypeadmin">Oversikt over inntekt type</Link>
          </li>
      </ul>
      <ul>
          <li>
            <Link to="/utgifttyperegistrering">Registrer ny utgift type</Link>
          </li>
          <li>
            <Link to="/utgifttypeadmin">Oversikt over utgift type</Link>
          </li>
      </ul>
      <ul>
          <li>
              <Link to="/inntektregistrering">Registrer ny inntekt</Link>
          </li>
          <li>
            <Link to="/inntektadmin">Administrer registrerte inntekter</Link>
          </li>
      </ul>
      <ul>
          <li>
              <Link to="/inntektregnskap">Inntekt regnskap</Link>
          </li>
      </ul>
      <ul>
          <li>
              <Link to="/utgiftregistrering">Registrer ny utgift</Link>
          </li>
          <li>
            <Link to="/utgiftadmin">Administrer registrerte utgifter</Link>
          </li>
      </ul>
    </div>
    </>
  )
}