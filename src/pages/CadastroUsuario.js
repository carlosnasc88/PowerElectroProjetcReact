import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CadastroUsuario.css";

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5500/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        const erro = await res.json();
        alert(`Erro: ${erro.error}`);
      }
    } catch (err) {
      alert("Erro ao cadastrar usuário.");
      console.error(err);
    }
  };

  return (
    <div >
      <div className="cadastro-box">
        <h2>Cadastrar Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
            />
            <label htmlFor="nome">Nome</label>
          </div>
          <div className="input-box">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">E-mail</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="senha"
              required
              value={formData.senha}
              onChange={handleChange}
            />
            <label htmlFor="senha">Senha</label>
          </div>
          <button type="submit" className="btn">Cadastrar</button>

          <div className="cadastro-link">
            <Link to="/">Voltar para login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
