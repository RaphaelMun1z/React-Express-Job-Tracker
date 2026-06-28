import { Check, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ESTADOS, MODELOS_TRABALHO, PRIORIDADES, STATUS, TECNOLOGIAS, TIPOS_CONTRATACAO } from "../configuracao";
import type { Candidatura, DadosCandidatura } from "../modelos/Candidatura";

interface Propriedades {
  candidatura: Candidatura | null;
  tecnologiasUsadas: string[];
  aoFechar: () => void;
  aoSalvar: (dados: DadosCandidatura, id?: string) => Promise<void>;
}

const hoje = () => {
  const data = new Date();
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
};

function dadosIniciais(candidatura: Candidatura | null): DadosCandidatura {
  return candidatura ? {
    company: candidatura.company, role: candidatura.role, status: candidatura.status,
    priority: candidatura.priority, location: candidatura.location, stateCode: candidatura.stateCode,
    technologies: candidatura.technologies, workModel: candidatura.workModel,
    employmentType: candidatura.employmentType, source: candidatura.source, link: candidatura.link,
    description: candidatura.description, salary: candidatura.salary, benefits: candidatura.benefits,
    applicationDate: candidatura.applicationDate
  } : {
    company: "", role: "", status: "Aplicado", priority: "Média", location: "",
    stateCode: "", technologies: [], workModel: "", employmentType: "", source: "",
    link: "", description: "", salary: "", benefits: "", applicationDate: hoje()
  };
}

export function FormularioCandidatura({ candidatura, tecnologiasUsadas, aoFechar, aoSalvar }: Propriedades) {
  const [dados, definirDados] = useState(() => dadosIniciais(candidatura));
  const [novaTecnologia, definirNovaTecnologia] = useState("");
  const [salvando, definirSalvando] = useState(false);
  useEffect(() => definirDados(dadosIniciais(candidatura)), [candidatura]);
  const tecnologias = useMemo(() => [...new Set([...TECNOLOGIAS, ...tecnologiasUsadas, ...dados.technologies])], [tecnologiasUsadas, dados.technologies]);
  const alterar = <C extends keyof DadosCandidatura>(campo: C, valor: DadosCandidatura[C]) => definirDados(atual => ({ ...atual, [campo]: valor }));

  function alternarTecnologia(tecnologia: string) {
    alterar("technologies", dados.technologies.includes(tecnologia)
      ? dados.technologies.filter(item => item !== tecnologia)
      : [...dados.technologies, tecnologia]);
  }

  function adicionarTecnologia() {
    const valor = novaTecnologia.trim();
    if (valor && !dados.technologies.includes(valor)) alterar("technologies", [...dados.technologies, valor]);
    definirNovaTecnologia("");
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    definirSalvando(true);
    try { await aoSalvar(dados, candidatura?.id); } finally { definirSalvando(false); }
  }

  return (
    <div className="modal-backdrop open" aria-hidden="false" onMouseDown={evento => evento.target === evento.currentTarget && aoFechar()}>
      <section className="modal-card form-modal" role="dialog" aria-modal="true">
        <div className="modal-header"><div><span className="section-label">Processo seletivo</span><h2>{candidatura ? "Editar candidatura" : "Nova candidatura"}</h2></div><button className="icon-button" type="button" onClick={aoFechar}><X /></button></div>
        <form className="application-form" onSubmit={enviar}>
          <div className="form-section"><h3>Informações principais</h3><div className="form-grid">
            <label><span>Empresa *</span><input required maxLength={80} value={dados.company} onChange={e => alterar("company", e.target.value)} /></label>
            <label><span>Cargo *</span><input required maxLength={100} value={dados.role} onChange={e => alterar("role", e.target.value)} /></label>
            <label><span>Status atual *</span><select value={dados.status} onChange={e => alterar("status", e.target.value)}>{STATUS.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span>Prioridade *</span><select value={dados.priority} onChange={e => alterar("priority", e.target.value)}>{PRIORIDADES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span>Data de envio *</span><input required type="date" value={dados.applicationDate} onChange={e => alterar("applicationDate", e.target.value)} /></label>
          </div></div>
          <div className="form-section"><h3>Formato e localização</h3><div className="form-grid">
            <label><span>Cidade ou localização</span><input value={dados.location} onChange={e => alterar("location", e.target.value)} /></label>
            <label><span>Estado</span><select value={dados.stateCode} onChange={e => alterar("stateCode", e.target.value)}><option value="">Não informado</option>{ESTADOS.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span>Modelo de trabalho</span><select value={dados.workModel} onChange={e => alterar("workModel", e.target.value)}><option value="">Não informado</option>{MODELOS_TRABALHO.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span>Tipo de contratação</span><select value={dados.employmentType} onChange={e => alterar("employmentType", e.target.value)}><option value="">Não informado</option>{TIPOS_CONTRATACAO.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span>Origem da vaga</span><select value={dados.source} onChange={e => alterar("source", e.target.value)}><option value="">Não informada</option>{["LinkedIn", "Gupy", "Indeed", "Indicação", "Site da empresa", "Outro"].map(item => <option key={item}>{item}</option>)}</select></label>
            <div className="full-width form-field"><span>Tecnologias</span><div className="technology-picker">
              <div className="technology-picker-options">{tecnologias.map(item => <label className={`technology-option ${dados.technologies.includes(item) ? "selected" : ""}`} key={item}><input type="checkbox" checked={dados.technologies.includes(item)} onChange={() => alternarTecnologia(item)} /><span>{item}</span></label>)}</div>
              <div className="technology-add-row"><input value={novaTecnologia} onChange={e => definirNovaTecnologia(e.target.value)} placeholder="Adicionar outra tecnologia" /><button className="secondary-button" type="button" onClick={adicionarTecnologia}><Plus />Adicionar</button></div>
            </div></div>
            <label className="full-width"><span>Link da vaga</span><input type="url" value={dados.link} onChange={e => alterar("link", e.target.value)} /></label>
          </div></div>
          <div className="form-section"><h3>Detalhes da oportunidade</h3><div className="form-grid">
            <label><span>Salário</span><input value={dados.salary} onChange={e => alterar("salary", e.target.value)} /></label>
            <label><span>Benefícios</span><input value={dados.benefits} onChange={e => alterar("benefits", e.target.value)} /></label>
            <label className="full-width"><span>Descrição e requisitos *</span><textarea required rows={6} value={dados.description} onChange={e => alterar("description", e.target.value)} /></label>
          </div></div>
          <div className="form-actions"><button className="secondary-button" type="button" onClick={aoFechar}>Cancelar</button><button className="primary-button" disabled={salvando}><Check />{salvando ? "Salvando..." : "Salvar candidatura"}</button></div>
        </form>
      </section>
    </div>
  );
}
