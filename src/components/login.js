import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login efetuado");
    navigate("/Menu");
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <br />
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input type="email" id="email" required />
          <label htmlFor="email">E-mail</label>
        </div>
        <div className="input-box">
          <input type="password" id="senha" required />
          <label htmlFor="senha">Senha</label>
        </div>
        <button type="submit" className="btn">Entrar</button>

        <div className="cadastro-lik">
          <button type="button" onClick={() => navigate("/CadastroUsuario")}>
            Cadastrar
          </button>
        </div>
        <div className="cadastro-lik">
          <button type="button" onClick={() => navigate("#")}>
            Recuperar Senha
          </button>
        </div>
      </form>

      {[...Array(50)].map((_, i) => (
        <span key={i} style={{ "--i": i }}></span>
      ))}
    </div>
  );
}
