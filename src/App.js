import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Home from './pages/Home';
import Casa from './pages/Casa';
import Inquilino from './pages/Inquilino';
import ListagemCasasAtivas from './pages/ListagemDeAtivos';
import ListagemInquilinos from './pages/ListagemInquilinos';
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api'; 
import CadastroUsuario from './pages/CadastroUsuario';
import Menu from './components/Menu';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/casa" element={<Casa />} />
        <Route path="/inquilino" element={<Inquilino />} />
        <Route path="/inquilino/:id" element={<Inquilino />} />
        <Route path="/CasasAtivas" element={<ListagemCasasAtivas />}/>
        <Route path="inquilinos/listagem-inquilinos" element={<ListagemInquilinos />}/>
        <Route path="/usuarios" element={<CadastroUsuario />} />
        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
       
        

      </Routes>
    </Router>
  );
}

export default App;
