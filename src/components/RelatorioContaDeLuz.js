// src/components/RelatorioContaDeLuz.js
import React from 'react';
import './RelatorioContaDeLuz.css'; // Importa o CSS específico para o relatório

const RelatorioContaDeLuz = ({ inquilino, historicoConsumo }) => {
  // Adicionados console.log para depuração
  console.log("RelatorioContaDeLuz: Inquilino recebido:", inquilino);
  console.log("RelatorioContaDeLuz: Histórico de Consumo recebido:", historicoConsumo);

  if (!inquilino || !historicoConsumo || historicoConsumo.length === 0) {
    console.log("RelatorioContaDeLuz: Dados de inquilino ou histórico ausentes/vazios.");
    return <div className="relatorio-placeholder">Carregando dados para o relatório...</div>;
  }

  // Dados do último registro de consumo para a fatura atual
  const ultimoRegistro = historicoConsumo[0];
  const mesAtual = String(ultimoRegistro.mes).padStart(2, '0');
  const anoAtual = ultimoRegistro.ano;
  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  
  // Exemplo de data de vencimento (10 dias após a emissão)
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + 10);
  const dataVencimentoStr = dataVencimento.toLocaleDateString('pt-BR');

  const kwhInicial = parseFloat(ultimoRegistro.kwh_inicial);
  const kwhAtual = parseFloat(ultimoRegistro.kwh_atual);
  const kwhGasto = parseFloat(ultimoRegistro.kwh_gasto);
  const valorKWhTarifa = parseFloat(inquilino.valor_kwh || 0.80); // Usar valor_kwh do inquilino ou 0.80 padrão

  // --- Simulação de Tarifas e Impostos (Ajuste conforme a Pw Eltric) ---
  const tarifaTUSD = 0.30; // Tarifa de Uso do Sistema de Distribuição (exemplo)
  const tarifaTE = 0.50;   // Tarifa de Energia (exemplo)
  const pis = 0.0165;     // PIS (1.65%)
  const cofins = 0.076;   // COFINS (7.6%)
  const icms = 0.25;      // ICMS (25% - varia por estado)

  const baseCalculoImpostos = kwhGasto * (tarifaTUSD + tarifaTE);
  const valorPIS = baseCalculoImpostos * pis;
  const valorCOFINS = baseCalculoImpostos * cofins;
  const valorICMS = baseCalculoImpostos * icms;

  const totalServicos = (kwhGasto * tarifaTUSD) + (kwhGasto * tarifaTE);
  const totalImpostos = valorPIS + valorCOFINS + valorICMS;
  const totalAPagar = totalServicos + totalImpostos; // Recalculado para incluir impostos

  // Simplificando o código de barras (apenas um placeholder)
  const codigoBarras = `846700000010${(totalAPagar * 100).toFixed(0).padStart(10, '0')}00000000000000000`; // Exemplo

  return (
    <div className="relatorio-conta-de-luz">
      <div className="secao cabecalho-pw-eltric">
        <div className="logo-pw-eltric">
          <img src="https://placehold.co/100x40/DFCD90/3A3427?text=PW%20Eltric" alt="Logo PW Eltric" />
        </div>
        <div className="info-concessionaria">
          <p>PW ELTRIC SERVIÇOS DE ENERGIA LTDA.</p>
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
        <div className="linha-dados">
          <span>Nome:</span> <strong>{inquilino.nome}</strong>
        </div>
        <div className="linha-dados">
          <span>CPF:</span> {inquilino.cpf}
        </div>
        <div className="linha-dados">
          <span>Endereço:</span> Bloco {inquilino.bloco}, Apartamento {inquilino.numeroap}
        </div>
        <div className="linha-dados">
          <span>Telefone:</span> {inquilino.celular}
        </div>
        <div className="linha-dados">
          <span>Nº Instalação:</span> {inquilino.numerorel || 'N/A'}
        </div>
      </div>

      <div className="secao detalhes-consumo-pw-eltric">
        <h3>Detalhes do Consumo - {mesAtual}/{anoAtual}</h3>
        <div className="consumo-grid">
          <div className="consumo-item-pw-eltric">
            <span>Leitura Anterior (KWh):</span> <strong>{kwhInicial.toFixed(2).replace('.', ',')}</strong>
          </div>
          <div className="consumo-item-pw-eltric">
            <span>Leitura Atual (KWh):</span> <strong>{kwhAtual.toFixed(2).replace('.', ',')}</strong>
          </div>
          <div className="consumo-item-pw-eltric">
            <span>Consumo (KWh):</span> <strong>{kwhGasto.toFixed(2).replace('.', ',')}</strong>
          </div>
          <div className="consumo-item-pw-eltric">
            <span>Período:</span> {mesAtual}/{anoAtual}
          </div>
          <div className="consumo-item-pw-eltric">
            <span>Dias Consumo:</span> {30} {/* Exemplo fixo, ajuste se tiver dados */}
          </div>
        </div>
      </div>

      <div className="secao discriminacao-fatura-pw-eltric">
        <h3>Discriminação da Fatura</h3>
        <div className="item-fatura">
          <span>Energia Consumida (TE): {kwhGasto.toFixed(2).replace('.', ',')} KWh x R$ {tarifaTE.toFixed(3).replace('.', ',')}/KWh</span>
          <span>R$ {(kwhGasto * tarifaTE).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="item-fatura">
          <span>Uso do Sistema (TUSD): {kwhGasto.toFixed(2).replace('.', ',')} KWh x R$ {tarifaTUSD.toFixed(3).replace('.', ',')}/KWh</span>
          <span>R$ {(kwhGasto * tarifaTUSD).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="item-fatura impostos">
          <span>PIS ({(pis * 100).toFixed(2)}%)</span>
          <span>R$ {valorPIS.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="item-fatura impostos">
          <span>COFINS ({(cofins * 100).toFixed(2)}%)</span>
          <span>R$ {valorCOFINS.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="item-fatura impostos">
          <span>ICMS ({(icms * 100).toFixed(2)}%)</span>
          <span>R$ {valorICMS.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="item-fatura total-fatura">
          <span>TOTAL A PAGAR</span>
          <span>R$ {totalAPagar.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <div className="secao historico-consumo-pw-eltric">
        <h3>Histórico de Consumo (KWh)</h3>
        <table>
          <thead>
            <tr>
              <th>Mês/Ano</th>
              <th>Consumo (KWh)</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {historicoConsumo.slice(0, 6).map((item, index) => { // Limita aos últimos 6 meses para caber
              const mesAno = `${String(item.mes).padStart(2, '0')}/${item.ano}`;
              const consumo = parseFloat(item.kwh_gasto);
              const valorMes = (consumo * valorKWhTarifa).toFixed(2).replace('.', ','); // Usar valorKWhTarifa
              return (
                <tr key={index}>
                  <td>{mesAno}</td>
                  <td>{consumo.toFixed(2).replace('.', ',')}</td>
                  <td>R$ {valorMes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="secao pagamento-pw-eltric">
        <h3>Informações para Pagamento</h3>
        <div className="valor-vencimento">
          <span>Valor Total:</span> <strong>R$ {totalAPagar.toFixed(2).replace('.', ',')}</strong>
        </div>
        <div className="valor-vencimento">
          <span>Vencimento:</span> <strong>{dataVencimentoStr}</strong>
        </div>
        <div className="codigo-barras">
          <p>Linha Digitável:</p>
          <p className="barcode-number">{codigoBarras}</p>
          <div className="barcode-placeholder">
            <span style={{width: '2px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '1px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '3px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '1px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '2px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '3px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '1px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '2px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '1px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
            <span style={{width: '3px', height: '20px', background: 'black', display: 'inline-block', margin: '0 1px'}}></span>
          </div>
        </div>
      </div>

      <div className="secao rodape-pw-eltric">
        <p>Este é um documento gerado para fins de demonstração. Os valores são simulados.</p>
        <p>Verifique sua fatura oficial da Pw Eltric para valores exatos.</p>
      </div>
    </div>
  );
};

export default RelatorioContaDeLuz;
