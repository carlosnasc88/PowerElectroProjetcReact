import React, { useEffect, useState } from 'react';
import './Ativos.css'; // Crie ou reaproveite o CSS

export default function Ativos() {
  const [inquilinos, setInquilinos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://localhost:5500/inquilinos')
      .then(res => res.json())
      .then(data => {
        // Filtra apenas os inquilinos com status "ativo"
        const ativos = data.filter(inq => inq.ativo === true || inq.ativo === "true");
        setInquilinos(ativos);
      })
      .catch(err => {
        console.error('Erro ao buscar inquilinos:', err);
        setErro('Erro ao carregar os inquilinos.');
      });
  }, []);

  return (
    <div className="ativos-container">
      <h1>Inquilinos Ativos</h1>
      {erro && <p className="error-message">{erro}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Casa (Bloco / Nº Relógio)</th>
          </tr>
        </thead>
        <tbody>
          {inquilinos.map((inq, index) => (
            <tr key={index}>
              <td>{inq.nome}</td>
              <td>{inq.bloco} / {inq.numerorel}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => window.history.back()}>Voltar</button>
    </div>
  );
}
