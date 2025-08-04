import React, { useState } from "react";
import "./login.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação
    setMensagem("Se o e-mail estiver cadastrado, enviaremos um link para redefinição.");
  };

  return (
    <div className="login-box">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">E-mail</label>
        </div>
        <button type="submit">Enviar link de recuperação</button>
        <div className="cadastro-lik">
          <a href="/login">Voltar para login</a>
        </div>
        {mensagem && <p className="center">{mensagem}</p>}
      </form>
    </div>
  );
}
