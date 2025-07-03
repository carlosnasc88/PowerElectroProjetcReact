import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './ListagemInquilinos.css';

export default function ListagemInquilinos() {
  const [inquilinos, setInquilinos] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5500/inquilinos/listagem-inquilinos")
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar inquilinos");
        return res.json();
      })
      .then(data => {
        setInquilinos(data);
        setLoading(false);
      })
      .catch(err => {
        setErro(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditar = (id) => {
    navigate(`/inquilino/${id}`);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Deseja realmente excluir esse inquilino?")) {
      fetch(`http://localhost:5500/inquilinos/${id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Erro ao excluir");
          setInquilinos(prev => prev.filter(i => i.id !== id));
        })
        .catch(err => alert(err.message));
    }
  };

  const ordenarInquilinos = (coluna) => {
    const novaDirecao = sortColumn === coluna && sortDirection === "asc" ? "desc" : "asc";

    const ordenados = [...inquilinos].sort((a, b) => {
      const valorA = (a[coluna] || "").toString().toLowerCase();
      const valorB = (b[coluna] || "").toString().toLowerCase();
      if (valorA < valorB) return novaDirecao === "asc" ? -1 : 1;
      if (valorA > valorB) return novaDirecao === "asc" ? 1 : -1;
      return 0;
    });

    setSortColumn(coluna);
    setSortDirection(novaDirecao);
    setInquilinos(ordenados);
  };

  const getSeta = (coluna) => {
    if (sortColumn !== coluna) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="listagem-page">
      <div className="listagem-container">
        <h1>Lista de Inquilinos</h1>
        {loading && <p>Carregando...</p>}
        {erro && <p className="error-message">{erro}</p>}

        <div className="tabela-scroll">
          <table>
            <thead>
              <tr>
                <th onClick={() => ordenarInquilinos("nome")}>Nome{getSeta("nome")}</th>
                <th onClick={() => ordenarInquilinos("cpf")}>CPF{getSeta("cpf")}</th>
                <th onClick={() => ordenarInquilinos("celular")}>Celular{getSeta("celular")}</th>
                <th onClick={() => ordenarInquilinos("email")}>E-mail{getSeta("email")}</th>
                <th onClick={() => ordenarInquilinos("bloco")}>Bloco{getSeta("bloco")}</th>
                <th onClick={() => ordenarInquilinos("numeroap")}>Casa{getSeta("numeroap")}</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {inquilinos.map(i => (
                <tr key={i.id}>
                  <td>{i.nome}</td>
                  <td>{i.cpf}</td>
                  <td>{i.celular}</td>
                  <td>{i.email}</td>
                  <td>{i.bloco}</td>
                  <td>{i.numeroap}</td>
                  <td>
                    <button onClick={() => handleEditar(i.id)}>Editar</button>
                    <button onClick={() => handleExcluir(i.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {inquilinos.length === 0 && (
                <tr><td colSpan={7}>Nenhum inquilino encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="button-group" style={{ marginTop: "30px", justifyContent: "center" }}>
          <button onClick={() => navigate("/inquilino")}>Novo Inquilino</button>
          <button onClick={() => navigate("/")}>Voltar para Página Inicial</button>

        </div>
      </div>
    </div>
  );
}
