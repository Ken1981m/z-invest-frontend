// @ts-nocheck 
import React, { useState } from 'react'
import './App.css'
import './styles/forms.scss';
import './styles/mainpage.scss';
import './styles/table-presentation.scss';
import './styles/zinvest.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Utleie } from './components/Utleie';
import { Leilighet } from './components/Leilighet';
import { InntektTypeRegistrering } from './components/InntektTypeRegistrering';
import { Inntektregistrering } from './components/Inntektregistrering';
import { Utgiftregistrering } from './components/Utgiftregistrering';
import { Regnskap } from './components/Regnskap';
import { InntektTypeAdmin } from './components/InntektTypeAdmin';
import { InntektTypeEdit } from './components/InntektTypeEdit';
import { UtgiftTypeRegistrering } from './components/UtgiftTypeRegistrering';
import { UtgiftTypeAdmin } from './components/UtgiftTypeAdmin';
import { UtgiftTypeEdit } from './components/UtgiftTypeEdit';
import { InntektAdmin } from './components/InntektAdmin';
import { UtgiftAdmin } from './components/UtgiftAdmin';
import { LeilighetAdmin } from './components/LeilighetAdmin';
import { LeilighetEdit } from './components/LeilighetEdit';
import { SkatteprosentAdmin } from './components/SkatteprosentAdmin';
import { FaktiskBetaltSkatt } from './components/FaktiskBetaltSkatt';
import {InntektUtgiftAdmin} from "./components/InntektUtgiftAdmin.tsx";

function App() {
   return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Utleie />} />
              <Route path="/leilighet" element={<Leilighet />} />
              <Route path="/leilighetadmin" element={<LeilighetAdmin />} />
              <Route path="/editLeilighet" element={<LeilighetEdit />} />
              <Route path="/inntekttyperegistrering" element={<InntektTypeRegistrering />} />
              <Route path="/inntekttypeadmin" element={<InntektTypeAdmin />} />
              <Route path="/editInntektType" element={<InntektTypeEdit />} />
              <Route path="/inntektregistrering" element={<Inntektregistrering />} />
              <Route path="/inntektutgiftadmin" element={<InntektUtgiftAdmin />} />
              <Route path="/inntektadmin" element={<InntektAdmin />} />
              <Route path="/regnskap" element={<Regnskap />} />
              <Route path="/utgifttyperegistrering" element={<UtgiftTypeRegistrering />} />
              <Route path="/utgifttypeadmin" element={<UtgiftTypeAdmin />} />
              <Route path="/editUtgiftType" element={<UtgiftTypeEdit />} />
              <Route path="/utgiftregistrering" element={<Utgiftregistrering />} />
              <Route path="/utgiftadmin" element={<UtgiftAdmin />} />
              <Route path="/skatteprosentadmin" element={<SkatteprosentAdmin />} />
              <Route path='/faktiskbetaltskattadmin' element={<FaktiskBetaltSkatt />} />
            </Routes>
        </BrowserRouter>
   );
}

export default App
