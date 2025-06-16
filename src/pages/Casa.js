import React, { useState } from 'react';
import './Casa.css'; 

export default function Casa() {
  const [form, setForm] = useState({
    numeroap: '',
    bloco: '',
    numerorel: '',
    kwhinicial: '',
    kwhatual: '',
    valorKwh: ''
  });

  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validarCampos = () => {
    const { numeroap, bloco, numerorel, kwhinicial, kwhatual, valorKwh } = form;
    if (!numeroap || !bloco || !numerorel || !kwhinicial || !kwhatual || !valorKwh) {
      setErro('Preencha todos os campos corretamente.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const dados = {
      ...form,
      numeroap: parseInt(form.numeroap),
      numerorel: parseInt(form.numerorel),
      kwhinicial: parseFloat(form.kwhinicial),
      kwhatual: parseFloat(form.kwhatual),
      valorKwh: parseFloat(form.valorKwh)
    };

    fetch('http://localhost:5500/casas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao salvar dados');
        }
        return response.json();
      })
      .then(data => {
        console.log('Apartamento salvo com sucesso:', data);
        window.location.href = '/ativos'; 
      })
      .catch(err => {
        console.error('Erro ao salvar:', err);
        setErro('Erro ao salvar os dados. Verifique o console.');
      });
  };

  return (
    <div className="page-background">
      <div className="cadastro-container">
        <h1>Cadastro de Apartamento</h1>

        {erro && <p className="error-message">{erro}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="numeroap"
            placeholder="Número do Apartamento"
            value={form.numeroap}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="bloco"
            placeholder="Bloco"
            value={form.bloco}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="numerorel"
            placeholder="Número do Relógio"
            value={form.numerorel}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="kwhinicial"
            placeholder="Kwh Inicial"
            value={form.kwhinicial}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="kwhatual"
            placeholder="Kwh Atual"
            value={form.kwhatual}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="valorKwh"
            placeholder="Valor Kwh (R$)"
            step="0.01"
            value={form.valorKwh}
            onChange={handleChange}
            required
          />

          <div className="button-group">
            <button type="submit" className="button-default">Salvar</button>
            <button type="button" className="button-danger" onClick={() => window.history.back()}>Cancelar</button>
            <button type="button" className="button-default" onClick={() => window.location.href = '/ativos'}>Lista de Ativos</button>
          </div>
        </form>
      </div>
    </div>
  );
}
