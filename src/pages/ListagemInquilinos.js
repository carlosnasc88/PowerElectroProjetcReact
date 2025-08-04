import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RelatorioContaDeLuz from "../components/RelatorioContaDeLuz";
import "./ListagemInquilinos.css";

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle === null) return null;
  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="var(--primary-gold)" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="var(--primary-gold)"
        strokeWidth={3}
      />
    </g>
  );
}

function HistoricoComGrafico({ inquilinoId, nome, inquilinoCompleto }) {
  const [dados, setDados] = useState([]);
  const [consumoAtual, setConsumoAtual] = useState(0);
  const relatorioRef = useRef(null);

  useEffect(() => {
    if (inquilinoId) {
      fetch(
        `http://localhost:5500/inquilinos/${inquilinoId}/historico-completo`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`Erro HTTP! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const dadosOrdenados = data.sort((a, b) => {
            if (a.ano === b.ano) return b.mes - a.mes;
            return b.ano - a.ano;
          });
          setDados(dadosOrdenados);
          if (dadosOrdenados.length > 0) {
            setConsumoAtual(parseFloat(dadosOrdenados[0].kwh_gasto));
          }
        })
        .catch((err) =>
          console.error("Erro ao carregar histórico completo:", err)
        );
    }
  }, [inquilinoId]);

  const dadosGrafico = dados
    .map((d) => ({
      mes: `${String(d.mes).padStart(2, "0")}/${d.ano}`,
      consumo: parseFloat(d.kwh_gasto),
    }))
    .reverse();

  const gerarPdfContaDeLuz = async () => {
    if (!relatorioRef.current) return;
    const relatorioElement = relatorioRef.current;
    relatorioElement.style.position = "static";
    relatorioElement.style.left = "0";
    relatorioElement.style.top = "0";

    const ultimoRegistro = dados.length > 0 ? dados[0] : null;
    const mesAnoReferencia = ultimoRegistro
      ? `${String(ultimoRegistro.mes).padStart(2, "0")}-${ultimoRegistro.ano}`
      : "N_A";

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    const canvas = await html2canvas(relatorioElement, {
      scale: 2,
      useCORS: true,
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgProportionalHeight = (canvas.height * imgWidth) / canvas.width;
    const finalImgHeight = Math.min(imgProportionalHeight, pageHeight);
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalImgHeight);
    pdf.save(
      `conta_luz_${inquilinoCompleto.nome.replace(
        /\s+/g,
        "_"
      )}_${mesAnoReferencia}.pdf`
    );

    relatorioElement.style.position = "absolute";
    relatorioElement.style.left = "-9999px";
    relatorioElement.style.top = "-9999px";
  };

  return (
    <div className="historico-container">
      <div className="historico-gauge">
        <h3>Consumo Atual (KWh)</h3>
        <GaugeContainer
          width={200}
          height={200}
          startAngle={-110}
          endAngle={110}
          value={consumoAtual}
          valueMin={0}
          valueMax={500}
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
          <GaugePointer />
        </GaugeContainer>
        <div className="gauge-value-num">{consumoAtual} KWh</div>
      </div>

      <div className="historico-info">
        <h2>Histórico de Consumo de {nome}</h2>
        {dadosGrafico.length > 0 ? (
          <BarChart
            dataset={dadosGrafico}
            yAxis={[
              {
                scaleType: "band",
                dataKey: "mes",
                label: "Mês/Ano",
                tickLabelStyle: { fill: "var(--light-text)" },
              },
            ]}
            xAxis={[
              {
                label: "Consumo (KWh)",
                tickLabelStyle: { fill: "var(--primary-gold)" },
              },
            ]}
            series={[
              {
                dataKey: "consumo",
                label: "Consumo (KWh)",
                color: "var(--primary-gold)",
              },
            ]}
            layout="horizontal"
            height={300}
            margin={{ left: 80 }}
          />
        ) : (
          <p>Nenhum dado de histórico disponível para {nome}.</p>
        )}
        <button className="btn-gerar-pdf" onClick={gerarPdfContaDeLuz}>
          <i className="pi pi-file-pdf"></i> Gerar Conta de Luz (PDF)
        </button>
      </div>

      <div ref={relatorioRef} className="relatorio-container-hidden">
        <RelatorioContaDeLuz
          inquilino={inquilinoCompleto}
          historicoConsumo={dados}
        />
      </div>
    </div>
  );
}

export default function ListagemInquilinos() {
  const [inquilinos, setInquilinos] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [inquilinoSelecionado, setInquilinoSelecionado] = useState(null);
  const [forcarAtualizacaoHistorico, setForcarAtualizacaoHistorico] =
    useState(0);
  const toast = useRef(null);
  const navigate = useNavigate();

  const recarregarInquilinos = async () => {
    try {
      const res = await fetch("http://localhost:5500/listagem-inquilinos");
      if (!res.ok) throw new Error(`Erro HTTP! Status: ${res.status}`);
      const data = await res.json();
      setInquilinos(data);
    } catch (err) {
      console.error("Erro ao recarregar inquilinos:", err);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao recarregar a lista de inquilinos.",
      });
    }
  };

  useEffect(() => {
    recarregarInquilinos();
  }, []);

  const handleVerHistorico = (inquilino) => {
    setInquilinoSelecionado(inquilino);
    setMostrarHistorico(true);
  };

  const handleEditar = (inquilino) => {
    navigate(`/inquilino/${inquilino.id}`);
    toast.current.show({
      severity: "info",
      summary: "Redirecionando",
      detail: `Editando ${inquilino.nome}...`,
    });
  };

  const handleExcluir = async (inquilino) => {
    const confirmar = window.confirm(`Deseja excluir ${inquilino.nome}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(
        `http://localhost:5500/inquilinos/${inquilino.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      toast.current.show({
        severity: "success",
        summary: "Excluído",
        detail: `${inquilino.nome} removido.`,
      });
      recarregarInquilinos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao excluir inquilino.",
      });
    }
  };

  const handleAtualizarKwh = async (inquilino) => {
    const novoKwh = prompt(
      `Novo KWh para ${inquilino.nome}:`,
      inquilino.kwh_atual || ""
    );
    if (novoKwh !== null && !isNaN(parseFloat(novoKwh))) {
      try {
        const res = await fetch(
          `http://localhost:5500/inquilinos/${inquilino.id}/atualizar-kwh`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kwhatual: parseFloat(novoKwh) }),
          }
        );
        if (!res.ok) throw new Error();
        toast.current.show({
          severity: "success",
          summary: "Atualizado",
          detail: "KWh atualizado com sucesso!",
        });
        await recarregarInquilinos();
        setForcarAtualizacaoHistorico((prev) => prev + 1);
      } catch {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao atualizar KWh.",
        });
      }
    }
  };

  const acoesMenu = (inquilino) => [
    {
      label: "Editar",
      icon: "pi pi-pencil",
      command: () => handleEditar(inquilino),
    },
    {
      label: "Excluir",
      icon: "pi pi-trash",
      command: () => handleExcluir(inquilino),
    },
    {
      label: "Atualizar KWh",
      icon: "pi pi-sync",
      command: () => handleAtualizarKwh(inquilino),
    },
  ];

  return (
    <div className="listagem-page">
      <Toast ref={toast} />
      <div className="listagem-header">
        <h1>Listagem de Inquilinos</h1>
        <button
          className="btn-voltar"
          onClick={() => (window.location.href = "/Menu")}
        >
          Voltar à Página Inicial
        </button>
      </div>

      <div className="listagem-container">
        <div className="tabela-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Celular</th>
                <th>Bloco</th>
                <th>N°Ap</th>
                <th>KWh Atual</th>
                <th>Valor(R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {inquilinos.length > 0 ? (
                inquilinos.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nome}</td>
                    <td>{i.cpf}</td>
                    <td>{i.celular}</td>
                    <td>{i.bloco}</td>
                    <td>{i.numeroap}</td>
                    <td>{i.kwh_atual || "-"}</td>
                    <td>
                      {i.valor_total
                        ? `R$ ${parseFloat(i.valor_total)
                            .toFixed(2)
                            .replace(".", ",")}`
                        : "-"}
                    </td>
                    <td className="botoes-acoes">
                      <SplitButton
                        label="Opções"
                        model={acoesMenu(i)}
                        className="split-button-custom"
                      />
                      <button
                        className="btn-ver-historico"
                        onClick={() => handleVerHistorico(i)}
                      >
                        <i className="pi pi-chart-line"></i> Ver Histórico
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Nenhum inquilino encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarHistorico && inquilinoSelecionado && (
        <div className="historico-wrapper">
          <button
            className="btn-fechar-historico"
            onClick={() => setMostrarHistorico(false)}
          >
            <i className="pi pi-times"></i> Fechar Histórico
          </button>
          <HistoricoComGrafico
            key={`${inquilinoSelecionado.id}-${forcarAtualizacaoHistorico}`}
            inquilinoId={inquilinoSelecionado.id}
            nome={inquilinoSelecionado.nome}
            inquilinoCompleto={inquilinoSelecionado}
          />
        </div>
      )}
    </div>
  );
}
