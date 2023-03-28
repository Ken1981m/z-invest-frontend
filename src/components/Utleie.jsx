import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Leilighet from './Leilighet';

function Utleie() {
  return (
    <div>
      <h1>Z-Invest</h1>
      <ul>
          <li>
             <Link to="/leilighet">Registrer ny leilighet</Link>
          </li>
      </ul>
    </div>
  )
}

export default Utleie;