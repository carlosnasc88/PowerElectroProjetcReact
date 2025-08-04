import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// IMPORTANTE: Este componente agora depende de um arquivo CSS externo com as classes fornecidas.
// Certifique-se de que o arquivo CSS está importado no seu projeto.
// Ex: import './ListagemInquilinos.css';

const App = () => {
    // Componente de Relatório de Conta de Luz - Refatorado para receber dados via props e usar classes CSS
    const RelatorioContaDeLuz = ({ inquilino, historicoConsumo }) => {
        if (!inquilino || !historicoConsumo) {
            return null;
        }

        if (historicoConsumo.length === 0) {
            return (
                <div className="relatorio-conta-de-luz">
                    <div className="relatorio-placeholder">
                        Nenhum histórico de consumo encontrado para este inquilino.
                    </div>
                </div>
            );
        }

        const ultimoRegistro = historicoConsumo[0];
        const mesAtual = String(ultimoRegistro.mes).padStart(2, '0');
        const anoAtual = ultimoRegistro.ano;
        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        const dataVencimento = new Date();
        dataVencimento.setDate(dataVencimento.getDate() + 10);
        const dataVencimentoStr = dataVencimento.toLocaleDateString('pt-BR');

        const kwhInicial = parseFloat(ultimoRegistro.kwh_inicial) || 0;
        const kwhAtual = parseFloat(ultimoRegistro.kwh_atual) || 0;
        const kwhGasto = parseFloat(ultimoRegistro.kwh_gasto) || 0;
        const valorKWhTarifa = parseFloat(ultimoRegistro.valor_kwh || 1.07);

        const tarifaTUSD = 0.30;
        const tarifaTE = 0.50;
        const pis = 0.0165;
        const cofins = 0.076;
        const icms = 0.25;

        const totalServicos = (kwhGasto * tarifaTUSD) + (kwhGasto * tarifaTE);
        const baseCalculoImpostos = totalServicos;
        const valorPIS = baseCalculoImpostos * pis;
        const valorCOFINS = baseCalculoImpostos * cofins;
        const valorICMS = baseCalculoImpostos * icms;

        const totalImpostos = valorPIS + valorCOFINS + valorICMS;
        const totalAPagar = parseFloat(ultimoRegistro.valor_total) || (totalServicos + totalImpostos);
        const codigoBarras = `846700000010${(totalAPagar * 100).toFixed(0).padStart(10, '0')}00000000000000000`;

        return (
            <div className="relatorio-conta-de-luz">
                <div className="cabecalho-pw-eltric secao">
                    <div className="logo-pw-eltric">
                        <img src="https://placehold.co/150x60/DFCD90/3A3427?text=PW+Eltric" alt="Logo PW Eltric" />
                    </div>
                    <div className="info-concessionaria">
                        <p className="font-semibold">PW ELTRIC SERVIÇOS DE ENERGIA LTDA.</p>
                        <p>CNPJ: 03.986.320/0001-02</p>
                        <p>Atendimento: 0800 123 4567</p>
                    </div>
                    <div className="info-fatura">
                        <p><strong>Nº da Fatura:</strong> {inquilino.id}-{mesAtual}{anoAtual}</p>
                        <p><strong>Emissão:</strong> {dataEmissao}</p>
                        <p><strong>Vencimento:</strong> {dataVencimentoStr}</p>
                    </div>
                </div>
                <div className="secao dados-cliente-pw-eltric">
                    <h3>Dados do Cliente</h3>
                    <div>
                        <div className="linha-dados"><span className="font-semibold">Nome:</span> <span>{inquilino.nome}</span></div>
                        <div className="linha-dados"><span className="font-semibold">CPF:</span> <span>{inquilino.cpf}</span></div>
                        <div className="linha-dados"><span className="font-semibold">Endereço:</span> <span>Bloco {inquilino.bloco}, Apartamento {inquilino.numeroap}</span></div>
                        <div className="linha-dados"><span className="font-semibold">Telefone:</span> <span>{inquilino.celular}</span></div>
                        <div className="linha-dados"><span className="font-semibold">Email:</span> <span>{inquilino.email}</span></div>
                        <div className="linha-dados"><span className="font-semibold">Nº Instalação:</span> <span>{inquilino.casa_id || 'N/A'}</span></div>
                    </div>
                </div>
                <div className="secao">
                    <h3>Detalhes do Consumo - {mesAtual}/{anoAtual}</h3>
                    <div className="consumo-grid">
                        <div className="consumo-item-pw-eltric"><span>Leitura Ant. (KWh):</span> <strong>{kwhInicial.toFixed(2).replace('.', ',')}</strong></div>
                        <div className="consumo-item-pw-eltric"><span>Leitura Atual (KWh):</span> <strong>{kwhAtual.toFixed(2).replace('.', ',')}</strong></div>
                        <div className="consumo-item-pw-eltric"><span>Consumo (KWh):</span> <strong>{kwhGasto.toFixed(2).replace('.', ',')}</strong></div>
                        <div className="consumo-item-pw-eltric"><span>Período:</span> <strong>{mesAtual}/{anoAtual}</strong></div>
                        <div className="consumo-item-pw-eltric"><span>Dias Consumo:</span> <strong>30</strong></div>
                    </div>
                </div>
                <div className="secao discriminacao-fatura-pw-eltric">
                    <h3>Discriminação da Fatura</h3>
                    <div>
                        <div className="item-fatura"><span>Energia Consumida (KWh)</span><span>{kwhGasto.toFixed(2).replace('.', ',')}</span></div>
                        <div className="item-fatura"><span>Tarifa de Uso do Sistema (TUSD)</span><span>R$ {(kwhGasto * tarifaTUSD).toFixed(2).replace('.', ',')}</span></div>
                        <div className="item-fatura"><span>Tarifa de Energia (TE)</span><span>R$ {(kwhGasto * tarifaTE).toFixed(2).replace('.', ',')}</span></div>
                        <div className="item-fatura"><span>Impostos (PIS/COFINS/ICMS)</span><span>R$ {totalImpostos.toFixed(2).replace('.', ',')}</span></div>
                        <div className="item-fatura total-fatura"><span>TOTAL A PAGAR</span><span>R$ {totalAPagar.toFixed(2).replace('.', ',')}</span></div>
                    </div>
                </div>
                <div className="secao historico-consumo-pw-eltric">
                    <h3>Histórico de Consumo (KWh)</h3>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mês/Ano</th>
                                    <th>Consumo (KWh)</th>
                                    <th>Valor (R$)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoConsumo.slice(0, 6).map((item, index) => {
                                    const mesAno = `${String(item.mes).padStart(2, '0')}/${item.ano}`;
                                    const consumo = parseFloat(item.kwh_gasto) || 0;
                                    const valorMes = parseFloat(item.valor_total) || (consumo * (parseFloat(item.valor_kwh) || valorKWhTarifa));
                                    return (
                                        <tr key={index}>
                                            <td>{mesAno}</td>
                                            <td>{consumo.toFixed(2).replace('.', ',')}</td>
                                            <td>R$ {valorMes.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="secao pagamento-pw-eltric">
                    <h3>Informações para Pagamento</h3>
                    <div>
                        <div className="valor-vencimento"><span>Valor Total: </span><strong>R$ {totalAPagar.toFixed(2).replace('.', ',')}</strong></div>
                        <div className="valor-vencimento"><span>Vencimento: </span><strong>{dataVencimentoStr}</strong></div>
                    </div>
                    <div className="codigo-barras">
                        <p>Linha Digitável:</p>
                        <p className="barcode-number">{codigoBarras}</p>
                    </div>
                </div>
                <div className="rodape-pw-eltric">
                    <p>Este é um documento gerado para fins de demonstração. Os valores podem ser simulados.</p>
                    <p>Verifique sua fatura oficial da Pw Eltric para valores exatos.</p>
                </div>
            </div>
        );
    };

    const [inquilinos, setInquilinos] = useState([]);
    const [inquilinoSelecionado, setInquilinoSelecionado] = useState(null);
    const [historicoData, setHistoricoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const relatorioRef = useRef(null);

    useEffect(() => {
        const fetchInquilinos = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5500/listagem-inquilinos");
                if (!res.ok) throw new Error(`Erro HTTP! Status: ${res.status}`);
                const data = await res.json();
                setInquilinos(data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar inquilinos:", err);
                setError("Falha ao carregar a lista de inquilinos.");
                setLoading(false);
            }
        };
        fetchInquilinos();
    }, []);

    useEffect(() => {
        const fetchHistorico = async () => {
            if (!inquilinoSelecionado) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:5500/inquilinos/${inquilinoSelecionado.id}/historico-completo`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setHistoricoData([]);
                        setLoading(false);
                        return;
                    }
                    throw new Error(`Erro HTTP! Status: ${res.status}`);
                }
                const data = await res.json();
                const dadosOrdenados = data.sort((a, b) => {
                    if (b.ano !== a.ano) return b.ano - a.ano;
                    return b.mes - a.mes;
                });
                setHistoricoData(dadosOrdenados);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar histórico:", err);
                setError("Falha ao carregar o histórico de consumo.");
                setLoading(false);
            }
        };
        fetchHistorico();
    }, [inquilinoSelecionado]);

    const handleVerHistorico = (inquilino) => {
        setInquilinoSelecionado(inquilino);
    };

    const handleVoltar = () => {
        setInquilinoSelecionado(null);
        setHistoricoData([]);
    };
    
    const handleEditar = (inquilino) => {
        alert(`Redirecionando para a página de edição do inquilino ${inquilino.id}...`);
    };

    const handleExcluir = (inquilino) => {
        if (window.confirm(`Deseja realmente excluir o inquilino ${inquilino.nome}?`)) {
             alert(`Inquilino ${inquilino.nome} excluído! (Ação simulada)`);
        }
    };
    
    const gerarPdfContaDeLuz = async (inquilinoCompleto, dados) => {
        if (!relatorioRef.current) return;
        const relatorioElement = relatorioRef.current;
        relatorioElement.style.position = "static";
        relatorioElement.style.left = "0";
        relatorioElement.style.top = "0";
        
        const ultimoRegistro = dados.length > 0 ? dados[0] : null;
        const mesAnoReferencia = ultimoRegistro ? `${String(ultimoRegistro.mes).padStart(2, "0")}-${ultimoRegistro.ano}` : "N_A";

        const canvas = await html2canvas(relatorioElement, {
            scale: 2,
            useCORS: true,
            windowWidth: relatorioElement.scrollWidth,
            windowHeight: relatorioElement.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgProportionalHeight = (canvas.height * imgWidth) / canvas.width;
        
        let position = 0;
        
        if (imgProportionalHeight > pageHeight) {
            let heightLeft = imgProportionalHeight;
            while(heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgProportionalHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;
                if(heightLeft > 0) {
                    pdf.addPage();
                }
            }
        } else {
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgProportionalHeight);
        }
        
        pdf.save(`conta_luz_${inquilinoCompleto.nome.replace(/\s+/g, "_")}_${mesAnoReferencia}.pdf`);
        
        relatorioElement.style.position = "absolute";
        relatorioElement.style.left = "-9999px";
        relatorioElement.style.top = "-9999px";
    };

    const ListagemView = () => (
        <div className="listagem-page">
            <div className="cabecalho-lista">
                <h1 className="text-4xl">Listagem de Inquilinos</h1>
                <button
                    className="btn-voltar"
                    onClick={() => alert("Voltar para o Menu (navegação simulada)")}
                >
                    Voltar à Página Inicial
                </button>
            </div>
            
            {loading ? (
                <div className="loading-state">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando inquilinos...
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="tabela-container">
                    <div className="overflow-x-auto">
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
                                                {i.valor_total ? `R$ ${parseFloat(i.valor_total).toFixed(2).replace(".", ",")}` : "-"}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-acao btn-historico"
                                                    onClick={() => handleVerHistorico(i)}
                                                >
                                                    <i className="pi pi-chart-line"></i> Ver Histórico
                                                </button>
                                                <button
                                                    className="btn-acao btn-editar"
                                                    onClick={() => handleEditar(i)}
                                                >
                                                    <i className="pi pi-pencil"></i> Editar
                                                </button>
                                                <button
                                                    className="btn-acao btn-excluir"
                                                    onClick={() => handleExcluir(i)}
                                                >
                                                    <i className="pi pi-trash"></i> Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Nenhum inquilino encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
    
    const HistoricoView = () => (
        <div className="historico-page">
            <div className="cabecalho-historico">
                <h1 className="text-4xl">Histórico de {inquilinoSelecionado.nome}</h1>
                <div className="botoes-historico">
                    <button
                        className="btn-acao btn-pdf"
                        onClick={() => gerarPdfContaDeLuz(inquilinoSelecionado, historicoData)}
                    >
                        Gerar PDF
                    </button>
                    <button
                        className="btn-acao btn-voltar-lista"
                        onClick={handleVoltar}
                    >
                        Voltar
                    </button>
                </div>
            </div>
            
            {loading ? (
                 <div className="loading-state">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando histórico...
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className="grafico-consumo">
                        <h2>Gráfico de Consumo</h2>
                        <div className="dados-grafico">
                            <div className="consumo-atual">
                                <h3>Consumo Atual (KWh)</h3>
                                <div className="valor-consumo">{historicoData[0]?.kwh_gasto || 0} KWh</div>
                            </div>
                        </div>
                    </div>
                    <div ref={relatorioRef} className="absolute-hidden">
                        <RelatorioContaDeLuz inquilino={inquilinoSelecionado} historicoConsumo={historicoData} />
                    </div>
                    <RelatorioContaDeLuz inquilino={inquilinoSelecionado} historicoConsumo={historicoData} />
                </>
            )}
        </div>
    );

    return (
        <div className="app-container">
            {inquilinoSelecionado ? <HistoricoView /> : <ListagemView />}
        </div>
    );
};

export default App;
