import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Cabecalho } from "./componentes/Cabecalho";
import { DetalhesCandidatura } from "./componentes/DetalhesCandidatura";
import { FormularioCandidatura } from "./componentes/FormularioCandidatura";
import { ListaCandidaturas } from "./componentes/ListaCandidaturas";
import { PainelFiltros } from "./componentes/PainelFiltros";
import { GerenciadorUsuarios } from "./componentes/GerenciadorUsuarios";
import { useCandidaturas } from "./hooks/useCandidaturas";
import type { Candidatura, DadosCandidatura } from "./modelos/Candidatura";
import { filtrosIniciais } from "./modelos/Filtros";
import type { Usuario } from "./modelos/Usuario";
import { filtrarCandidaturas } from "./servicos/filtroCandidaturas";
import { baixarArquivo } from "./utilitarios/formatacao";

export function Aplicacao({ usuario, aoSair }: { usuario: Usuario; aoSair: () => void }) {
  const { candidaturas, carregando, erro, salvar, remover } = useCandidaturas();
  const [filtros, definirFiltros] = useState(filtrosIniciais);
  const [formularioAberto, definirFormularioAberto] = useState(false);
  const [emEdicao, definirEmEdicao] = useState<Candidatura | null>(null);
  const [emDetalhes, definirEmDetalhes] = useState<Candidatura | null>(null);
  const [aviso, definirAviso] = useState("");
  const [filtrosMoveisAbertos, definirFiltrosMoveisAbertos] = useState(false);
  const [usuariosAbertos, definirUsuariosAbertos] = useState(false);
  const visiveis = useMemo(() => filtrarCandidaturas(candidaturas, filtros), [candidaturas, filtros]);
  const quantidadeFiltros = [filtros.busca, filtros.uf !== "todos", filtros.origem !== "todos", filtros.periodo !== "todos", filtros.comSalario, filtros.comLink, filtros.somenteAtivas].filter(Boolean).length
    + filtros.status.length + filtros.modelos.length + filtros.contratacoes.length + filtros.prioridades.length + filtros.tecnologias.length;

  useEffect(() => {
    document.body.style.overflow = formularioAberto || emDetalhes || filtrosMoveisAbertos || usuariosAbertos ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [formularioAberto, emDetalhes, filtrosMoveisAbertos, usuariosAbertos]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => definirAviso(""), 3400);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  function abrirFormulario(candidatura: Candidatura | null = null) {
    definirEmEdicao(candidatura);
    definirFormularioAberto(true);
  }

  async function salvarCandidatura(dados: DadosCandidatura, id?: string) {
    try {
      await salvar(dados, id);
      definirFormularioAberto(false);
      definirAviso(id ? "Candidatura atualizada." : "Candidatura adicionada.");
    } catch (falha) {
      definirAviso((falha as Error).message);
    }
  }

  async function excluirCandidatura(candidatura: Candidatura) {
    if (!confirm(`Excluir a candidatura para ${candidatura.role} na empresa ${candidatura.company}?`)) return;
    await remover(candidatura.id);
    definirAviso("Candidatura excluída.");
  }

  function exportarCsv() {
    const cabecalhos = ["Empresa", "Cargo", "Status", "Prioridade", "Localização", "Estado", "Tecnologias", "Modelo", "Contratação", "Origem", "Link", "Descrição", "Salário", "Benefícios", "Data de envio", "Última atualização"];
    const linhas = visiveis.map(item => [item.company, item.role, item.status, item.priority, item.location, item.stateCode, item.technologies.join(", "), item.workModel, item.employmentType, item.source, item.link, item.description, item.salary, item.benefits, item.applicationDate, item.updatedAt]);
    const csv = [cabecalhos, ...linhas].map(linha => linha.map(valor => `"${String(valor || "").replaceAll('"', '""')}"`).join(";")).join("\n");
    baixarArquivo(["\uFEFF", csv], "candidaturas.csv", "text/csv;charset=utf-8");
    definirAviso("Planilha CSV exportada.");
  }

  return <div className="app-shell">
    <Cabecalho aoCriar={() => abrirFormulario()} aoExportarCsv={exportarCsv} usuario={usuario} aoSair={aoSair} aoGerenciarUsuarios={() => definirUsuariosAbertos(true)} />
    <main className="dashboard">
      <PainelFiltros candidaturas={candidaturas} filtros={filtros} aoAlterar={definirFiltros} abertoNoCelular={filtrosMoveisAbertos} aoFechar={() => definirFiltrosMoveisAbertos(false)} />
      <section className="content-panel">
        <div className="page-heading"><div><span className="section-label">Painel de controle</span><h1>Suas candidaturas</h1><p>Organize processos seletivos, tecnologias, localidades e etapas em um só lugar.</p></div><button className="mobile-filter-button secondary-button" onClick={() => definirFiltrosMoveisAbertos(true)}><SlidersHorizontal />Filtros</button></div>
        {carregando ? <p>Carregando candidaturas...</p> : <ListaCandidaturas candidaturas={visiveis} todasAsCandidaturas={candidaturas} quantidadeFiltros={quantidadeFiltros} aoDetalhar={definirEmDetalhes} aoEditar={abrirFormulario} aoExcluir={excluirCandidatura} aoCriar={() => abrirFormulario()} ordenacao={filtros.ordenacao} aoOrdenar={ordenacao => definirFiltros({ ...filtros, ordenacao })} />}
        {erro && <p className="filter-empty">{erro}</p>}
      </section>
    </main>
    <div className={`mobile-overlay ${filtrosMoveisAbertos ? "open" : ""}`} onClick={() => definirFiltrosMoveisAbertos(false)} />
    {formularioAberto && <FormularioCandidatura candidatura={emEdicao} tecnologiasUsadas={candidaturas.flatMap(item => item.technologies)} aoFechar={() => definirFormularioAberto(false)} aoSalvar={salvarCandidatura} />}
    {emDetalhes && <DetalhesCandidatura candidatura={emDetalhes} aoFechar={() => definirEmDetalhes(null)} aoEditar={() => { const candidatura = emDetalhes; definirEmDetalhes(null); abrirFormulario(candidatura); }} />}
    {usuariosAbertos && <GerenciadorUsuarios usuarioAtual={usuario} aoFechar={() => definirUsuariosAbertos(false)} />}
    {aviso && <div className="toast-region"><div className="toast">{aviso}</div></div>}
  </div>;
}
