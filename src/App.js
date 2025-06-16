import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Casa from './pages/Casa';
import Inquilino from './pages/Inquilino';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/casa" element={<Casa/>} />
        <Route path="/inquilino" element={<Inquilino/>} />
      </Routes>
    </Router>
  );
}

export default App;
