import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; // Descomente se o CSS estiver no mesmo diretório

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={() => navigate('/casa')}>
        <i className="fas fa-home"></i> Casa
      </button>
      <button className="menu-button" onClick={() => navigate('/inquilino')}>
        <i className="groups"></i>Inquilino
      </button>
      {/* Adicione mais botões se quiser */}
    </div>
  );
}
