import { Activity, Banknote, Briefcase, CalendarDays, Clock3, Code2, ExternalLink, Flag, HeartHandshake, MapPin, Pencil, Waypoints, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Candidatura } from "../modelos/Candidatura";
import { formatarData, formatarDataHora, gradiente, iniciais, slug } from "../utilitarios/formatacao";

interface Propriedades {
  candidatura: Candidatura;
  aoFechar: () => void;
  aoEditar: () => void;
}

function Informacao({ icone, rotulo, children }: { icone: ReactNode; rotulo: string; children: ReactNode }) {
  return <div className="info-row">{icone}<div><strong>{rotulo}</strong><span>{children}</span></div></div>;
}

export function DetalhesCandidatura({ candidatura, aoFechar, aoEditar }: Propriedades) {
  const local = [[candidatura.location, candidatura.stateCode].filter(Boolean).join(", "), candidatura.workModel].filter(Boolean).join(" · ") || "Não informado";
  const historico = [...candidatura.history].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div className="modal-backdrop open" onMouseDown={evento => evento.target === evento.currentTarget && aoFechar()}>
      <section className="modal-card detail-modal" role="dialog" aria-modal="true">
        <div className="modal-header"><div><span className="section-label">Detalhes da candidatura</span><h2>{candidatura.role}</h2></div><button className="icon-button" onClick={aoFechar}><X /></button></div>
        <div className="detail-body">
          <div className="detail-hero"><div className="company-logo" style={{ background: gradiente(candidatura.company) }}>{iniciais(candidatura.company)}</div><div><h3>{candidatura.role}</h3><p>{candidatura.company}</p></div><div className="detail-actions">{candidatura.link && <a className="secondary-button" href={candidatura.link} target="_blank" rel="noreferrer"><ExternalLink />Abrir vaga</a>}<button className="secondary-button" onClick={aoEditar}><Pencil />Editar</button></div></div>
          <div className="detail-grid"><div>
            <section className="detail-section"><h4>Descrição e requisitos</h4><p className="detail-copy">{candidatura.description}</p></section>
            <section className="detail-section" style={{ marginTop: 27 }}><h4>Linha do tempo de status</h4><div className="timeline">{historico.map(item => <div className="timeline-item" key={`${item.status}-${item.date}`}><span className="timeline-dot" /><div><strong>{item.status}</strong><time>{formatarDataHora(item.date)}</time></div></div>)}</div></section>
          </div><div className="info-list">
            <Informacao icone={<Activity />} rotulo="Status atual"><span className={`status-pill status-${slug(candidatura.status)}`}>{candidatura.status}</span></Informacao>
            <Informacao icone={<Flag />} rotulo="Prioridade">{candidatura.priority}</Informacao>
            <Informacao icone={<CalendarDays />} rotulo="Data de envio">{formatarData(candidatura.applicationDate)}</Informacao>
            <Informacao icone={<MapPin />} rotulo="Local e modelo">{local}</Informacao>
            <Informacao icone={<Code2 />} rotulo="Tecnologias"><span className="technology-list">{candidatura.technologies.map(item => <span className="technology-tag" key={item}>{item}</span>)}</span></Informacao>
            <Informacao icone={<Briefcase />} rotulo="Contratação">{candidatura.employmentType || "Não informada"}</Informacao>
            <Informacao icone={<Waypoints />} rotulo="Origem">{candidatura.source || "Não informada"}</Informacao>
            {candidatura.owner && <Informacao icone={<Briefcase />} rotulo="Responsável">{candidatura.owner.name} · {candidatura.owner.email}</Informacao>}
            <Informacao icone={<Banknote />} rotulo="Salário">{candidatura.salary || "Não informado"}</Informacao>
            <Informacao icone={<HeartHandshake />} rotulo="Benefícios">{candidatura.benefits || "Não informados"}</Informacao>
            <Informacao icone={<Clock3 />} rotulo="Última atualização">{formatarDataHora(candidatura.updatedAt)}</Informacao>
          </div></div>
        </div>
      </section>
    </div>
  );
}
