import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Casa from './pages/Casa';
import Inquilino from './pages/Inquilino';
import ListagemCasasAtivas from './pages/ListagemDeAtivos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/casa" element={<Casa/>} />
        <Route path="/inquilino" element={<Inquilino/>} />
        <Route path="/CasasAtivas" element={<ListagemCasasAtivas/>}/>
      </Routes>
    </Router>
  );
}

export default App;
