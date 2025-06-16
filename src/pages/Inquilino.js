import React, { useState } from 'react';
import './Inquilino.css';

export default function Inquilino() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    numerorel: '',
    bloco: '',
    kwhatual: '',
    celular: '',
    email: ''
  });

  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarCadastro = () => {
    const { nome, cpf, numerorel, bloco, kwhatual, celular, email } = form;

    if (
      !nome ||
      !cpf ||
      !numerorel ||
      !bloco ||
      !celular ||
      !email ||
      isNaN(parseFloat(kwhatual))
    ) {
      setErro('Por favor, preencha todos os campos corretamente.');
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('E-mail inválido.');
      return false;
    }

    setErro('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCadastro()) return;

    const dados = {
      ...form,
      kwhatual: parseFloat(form.kwhatual) || 0
    };

    fetch('http://localhost:5500/inquilinos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Dados salvos:', data);
        window.location.href = '/listagem-inquilinos';
      })
      .catch(err => {
        console.error('Erro ao enviar os dados:', err);
      });
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Inquilino</h1>

      {erro && <p className="error-message">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="numerorel"
          placeholder="Número do Relógio"
          value={form.numerorel}
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
          name="kwhatual"
          placeholder="Kwh Atual"
          value={form.kwhatual}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="celular"
          placeholder="Celular"
          value={form.celular}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => window.history.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
