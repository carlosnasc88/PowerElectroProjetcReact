import React from 'react';
import { useNavigate } from 'react-router-dom';
//import './Menu.css';

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="floating-menu-wrapper">
      <div className="floating-menu">
        <button className="menu-button" onClick={() => navigate('/casa')}>
          🏠 Casa
        </button>
        <button className="menu-button" onClick={() => navigate('/inquilino')}>
          👥 Inquilino
        </button>
        {/* Adicione mais botões aqui se necessário */}
      </div>
    </div>
  );
}

