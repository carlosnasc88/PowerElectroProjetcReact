import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Casa from './pages/Casa';
import Inquilino from './pages/Inquilino';
import ListagemCasasAtivas from './pages/ListagemDeAtivos';
import ListagemInquilinos from './pages/ListagemInquilinos';
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api'; 




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/casa" element={<Casa />} />
        <Route path="/inquilino" element={<Inquilino />} />
        <Route path="/inquilino/:id" element={<Inquilino />} />
        <Route path="/CasasAtivas" element={<ListagemCasasAtivas />}/>
        <Route path="inquilinos/listagem-inquilinos" element={<ListagemInquilinos />}/>
        

      </Routes>
    </Router>
  );
}

export default App;
