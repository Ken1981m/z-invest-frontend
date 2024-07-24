// @ts-nocheck 
import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Utleie } from './components/Utleie';
import { Leilighet } from './components/Leilighet';
import { Inntektregistrering } from './components/Inntektregistrering';
import { Utgiftregistrering } from './components/Utgiftregistrering';
import { Inntektregnskap } from './components/Inntektregnskap';

function App() {
   return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Utleie />} />
              <Route path="/leilighet" element={<Leilighet />} />
              <Route path="/inntektregistrering" element={<Inntektregistrering />} />
              <Route path="/utgiftregistrering" element={<Utgiftregistrering />} />
              <Route path="/inntektregnskap" element={<Inntektregnskap />} />
            </Routes>
        </BrowserRouter>
   );
}

export default App
