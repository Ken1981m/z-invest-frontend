import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Utleie from './components/Utleie';
import Leilighet from './components/Leilighet';
import Inntektregistrering from './components/Inntektregistrering';
import Utgiftregistrering from './components/Utgiftregistrering';
import Inntektregnskap from './components/Inntektregnskap';

function App() {
    return (
        <Router>
              <Routes>
                <Route path="/" element={<Utleie />} />
                <Route path="/leilighet" element={<Leilighet />} />
                <Route path="/inntektregistrering" element={<Inntektregistrering />} />
                <Route path="/utgiftregistrering" element={<Utgiftregistrering />} />
                <Route path="/inntektregnskap" element={<Inntektregnskap />} />
              </Routes>
       </Router>
      );
}

export default App;
