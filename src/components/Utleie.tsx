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
          <li>
              <Link to="/inntektregistrering">Registrer ny inntekt</Link>
          </li>
          <li>
              <Link to="/utgiftregistrering">Registrer ny utgift</Link>
          </li>
          <li>
              <Link to="/inntektregnskap">Inntekt regnskap</Link>
          </li>
      </ul>
    </div>
    </>
  )
}