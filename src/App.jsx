import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Utleie from './components/Utleie';
import Leilighet from './components/Leilighet';

function App() {
    return (
        <Router>
              <Routes>
                <Route path="/" element={<Utleie />} />
                <Route path="/leilighet" element={<Leilighet />} />
              </Routes>
       </Router>
      );
}

export default App;
