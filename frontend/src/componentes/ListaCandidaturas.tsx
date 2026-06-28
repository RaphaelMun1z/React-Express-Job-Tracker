import { Activity, BriefcaseBusiness, ExternalLink, Eye, Layers3, MapPin, MessagesSquare, Pencil, Trash2 } from "lucide-react";
import type { Candidatura } from "../modelos/Candidatura";
import { dataRelativa, gradiente, iniciais, slug } from "../utilitarios/formatacao";

interface Propriedades {
  candidaturas: Candidatura[];
  todasAsCandidaturas: Candidatura[];
  quantidadeFiltros: number;
  aoDetalhar: (candidatura: Candidatura) => void;
  aoEditar: (candidatura: Candidatura) => void;
  aoExcluir: (candidatura: Candidatura) => void;
  aoCriar: () => void;
  ordenacao: string;
  aoOrdenar: (ordenacao: string) => void;
}

export function ListaCandidaturas({ candidaturas, todasAsCandidaturas, quantidadeFiltros, aoDetalhar, aoEditar, aoExcluir, aoCriar, ordenacao, aoOrdenar }: Propriedades) {
  const emAndamento = todasAsCandidaturas.filter(item => !["Rejeitado", "Proposta"].includes(item.status)).length;
  return <>
    <div className="summary-grid">
      <article className="summary-card"><span className="summary-card-icon"><Layers3 /></span><div><strong>{todasAsCandidaturas.length}</strong><span>Total</span></div></article>
      <article className="summary-card"><span className="summary-card-icon"><Activity /></span><div><strong>{emAndamento}</strong><span>Em andamento na seleção</span></div></article>
      <article className="summary-card"><span className="summary-card-icon"><MessagesSquare /></span><div><strong>{todasAsCandidaturas.filter(item => item.status === "Entrevista").length}</strong><span>Entrevistas</span></div></article>
    </div>
    <div className="list-toolbar"><div className="results-summary"><strong>{candidaturas.length} {candidaturas.length === 1 ? "candidatura" : "candidaturas"}</strong><span>{quantidadeFiltros ? `${quantidadeFiltros} filtros ativos` : "Nenhum filtro aplicado"}</span></div><label className="sort-control"><span>Ordenar por</span><select value={ordenacao} onChange={evento => aoOrdenar(evento.target.value)}><option value="updated-desc">Atualização mais recente</option><option value="application-desc">Envio mais recente</option><option value="company-asc">Empresa A–Z</option><option value="priority">Maior prioridade</option><option value="status">Etapa do processo</option></select></label></div>
    <div className="application-list">{candidaturas.map(candidatura => {
      const local = [[candidatura.location, candidatura.stateCode].filter(Boolean).join(", "), candidatura.workModel].filter(Boolean).join(" · ") || "Local não informado";
      const etiquetas = [candidatura.employmentType, candidatura.source, candidatura.technologies[0]].filter(Boolean);
      return <article className="application-row" key={candidatura.id}>
        <div className="application-main"><div className="company-logo" style={{ background: gradiente(candidatura.company) }}>{iniciais(candidatura.company)}</div><div className="application-title"><h3>{candidatura.role}</h3><p>{candidatura.company} <span>· enviada {dataRelativa(candidatura.applicationDate, true)}</span></p></div></div>
        <div className="application-details"><div className="meta-line"><MapPin /><span>{local}</span></div><div className="inline-meta">{candidatura.owner && <span className="meta-tag" title={candidatura.owner.email}>{candidatura.owner.name}</span>}{etiquetas.map(item => <span className="meta-tag" key={item}>{item}</span>)}</div></div>
        <div className="application-state"><span className={`status-pill status-${slug(candidatura.status)}`}>{candidatura.status}</span><span className={`priority-pill priority-${slug(candidatura.priority)}`}>Prioridade {candidatura.priority.toLowerCase()}</span><span className="updated-at">Atualizada {dataRelativa(candidatura.updatedAt)}</span></div>
        <div className="row-actions"><button className="row-action" title="Ver detalhes" onClick={() => aoDetalhar(candidatura)}><Eye /></button><button className="row-action" title="Editar" onClick={() => aoEditar(candidatura)}><Pencil /></button>{candidatura.link && <a className="row-action" title="Abrir vaga" href={candidatura.link} target="_blank" rel="noreferrer"><ExternalLink /></a>}<button className="row-action danger" title="Excluir" onClick={() => aoExcluir(candidatura)}><Trash2 /></button></div>
      </article>;
    })}</div>
    {!candidaturas.length && <div className="empty-state"><span><BriefcaseBusiness /></span><h2>Nenhuma candidatura encontrada</h2><p>Altere os filtros ou cadastre uma nova oportunidade.</p><button className="primary-button" onClick={aoCriar}>Adicionar candidatura</button></div>}
  </>;
}
