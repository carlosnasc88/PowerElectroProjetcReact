import React, { useState, useEffect } from "react";
import "./Inquilino.css";

export default function Inquilino() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    celular: "",
    email: "",
    bloco: "",
    casaId: "",
    numerorel: "",
  });

  const [blocos, setBlocos] = useState([]);
  const [casas, setCasas] = useState([]);
  const [erro, setErro] = useState("");

  // Buscar blocos disponíveis ao montar componente
  useEffect(() => {
    fetch("http://localhost:5500/blocos-disponiveis")
      .then((res) => res.json())
      .then((data) => setBlocos(data.map((item) => item.bloco)))
      .catch((err) => {
        console.error("Erro ao carregar blocos:", err);
        setErro("Erro ao carregar blocos");
      });
  }, []);

  // Buscar casas disponíveis ao mudar bloco selecionado
  useEffect(() => {
    if (form.bloco) {
      fetch(`http://localhost:5500/casas-disponiveis/${form.bloco}`)
        .then((res) => res.json())
        .then((data) => {
          setCasas(Array.isArray(data) ? data : []);
          setForm((f) => ({ ...f, casaId: "", numerorel: "" })); // limpa casa selecionada ao mudar bloco
        })
        .catch((err) => {
          console.error("Erro ao carregar casas:", err);
          setCasas([]);
          setErro("Erro ao carregar casas");
        });
    } else {
      setCasas([]);
      setForm((f) => ({ ...f, casaId: "", numerorel: "" }));
    }
  }, [form.bloco]);

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
    return value;
  };

  const formatCelular = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      setForm({ ...form, cpf: formatCPF(value) });
    } else if (name === "celular") {
      setForm({ ...form, celular: formatCelular(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCasaChange = (e) => {
    const casaId = e.target.value;
    const casaSelecionada = casas.find((casa) => casa.id.toString() === casaId);
    setForm({
      ...form,
      casaId,
      numerorel: casaSelecionada ? casaSelecionada.numerorel : "",
    });
  };

  const validarCadastro = () => {
    const { nome, cpf, celular, email, bloco, casaId, numerorel } = form;
    if (
      !nome ||
      !cpf ||
      !celular ||
      !email ||
      !bloco ||
      !casaId ||
      !numerorel
    ) {
      setErro("Por favor, preencha todos os campos corretamente.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("E-mail inválido.");
      return false;
    }
    setErro("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarCadastro()) return;

    fetch("http://localhost:5500/inquilinos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Inquilino salvo:", data);
        window.location.href = "/listagem-inquilinos";
      })
      .catch((err) => {
        console.error("Erro ao salvar:", err);
        setErro("Erro ao salvar inquilino");
      });
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Inquilino</h1>
      {erro && <p className="error-message">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              maxLength={14}
              required
            />
          </div>

          <div className="form-field">
            <label>Celular</label>
            <input
              name="celular"
              value={form.celular}
              onChange={handleChange}
              maxLength={15}
              required
            />
          </div>

          <div className="form-field">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-grid two-columns">
          <div className="form-field">
            <label>Bloco</label>
            <select
              name="bloco"
              value={form.bloco}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {blocos.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Número da Casa</label>
            <select
              name="casaId"
              value={form.casaId}
              onChange={handleCasaChange}
              required
            >
              <option value="">Selecione</option>
              {casas.map((casa) => (
                <option key={casa.id} value={casa.id}>
                  {casa.numeroap}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Número do Relógio</label>
            <input name="numerorel" value={form.numerorel} readOnly />
          </div>
        </div>

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
