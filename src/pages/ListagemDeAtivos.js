import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListagemDeAtivos.css';


export default function ListagemCasasAtivas() {
  const [casas, setCasas] = useState([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5500/CasasAtivas') 
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar casas');
        return res.json();
      })
      .then(data => setCasas(data))
      .catch(err => setErro(err.message));
  }, []);

  return (
    <div className="ativos-container">
      <h1>Casas Ativas</h1>
      {erro && <p className="error-message">{erro}</p>}
      {casas.length === 0 && !erro && <p>Nenhuma casa ativa encontrada.</p>}
      <table>
        <thead>
          <tr>
            <th>Número Apartamento</th>
            <th>Bloco</th>
            <th>Número Relógio</th>
            <th>Kwh Inicial</th>
            <th>Kwh Atual</th>
            <th>Valor Kwh</th>
          </tr>
        </thead>
        <tbody>
          {casas.map((casa) => (
            <tr key={casa.id}>
              <td>{casa.numeroap}</td>
              <td>{casa.bloco}</td>
              <td>{casa.numerorel}</td>
              <td>{casa.kwhinicial}</td>
              <td>{casa.kwhatual}</td>
              <td>{typeof casa.valorKwh === "number" ? casa.valorKwh.toFixed(2) : "0.00"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-group">
        <button onClick={() => navigate('/')}>Voltar à Home</button>
      </div>
    </div>
  );
}
