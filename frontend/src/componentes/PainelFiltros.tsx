import { Check, Search, X } from "lucide-react";
import { ESTADOS, MODELOS_TRABALHO, PRIORIDADES, STATUS, TIPOS_CONTRATACAO } from "../configuracao";
import type { Candidatura } from "../modelos/Candidatura";
import { filtrosIniciais, type Filtros } from "../modelos/Filtros";

interface Propriedades {
  candidaturas: Candidatura[];
  filtros: Filtros;
  aoAlterar: (filtros: Filtros) => void;
  abertoNoCelular: boolean;
  aoFechar: () => void;
}

interface GrupoProps {
  titulo: string;
  opcoes: string[];
  selecionadas: string[];
  contagens: Record<string, number>;
  aoAlterar: (valores: string[]) => void;
}

function GrupoFiltro({ titulo, opcoes, selecionadas, contagens, aoAlterar }: GrupoProps) {
  function alternar(valor: string) {
    aoAlterar(selecionadas.includes(valor)
      ? selecionadas.filter(item => item !== valor)
      : [...selecionadas, valor]);
  }
  return (
    <div className="filter-section">
      <span className="filter-static-title">{titulo}</span>
      <div className="filter-body checkbox-list"><div>
        {opcoes.map(opcao => (
          <label className="checkbox-item" key={opcao}>
            <input type="checkbox" checked={selecionadas.includes(opcao)} onChange={() => alternar(opcao)} />
            <span className="custom-checkbox"><Check /></span>
            <span>{opcao}</span><small>{contagens[opcao] || 0}</small>
          </label>
        ))}
      </div></div>
    </div>
  );
}

export function PainelFiltros({ candidaturas, filtros, aoAlterar, abertoNoCelular, aoFechar }: Propriedades) {
  const alterar = <C extends keyof Filtros>(campo: C, valor: Filtros[C]) => aoAlterar({ ...filtros, [campo]: valor });
  const contar = (campo: keyof Candidatura) => candidaturas.reduce<Record<string, number>>((total, item) => {
    const valor = String(item[campo] || "");
    if (valor) total[valor] = (total[valor] || 0) + 1;
    return total;
  }, {});
  const tecnologias = [...new Set(candidaturas.flatMap(item => item.technologies))].sort();
  const contagemTecnologias = candidaturas.flatMap(item => item.technologies).reduce<Record<string, number>>((total, item) => {
    total[item] = (total[item] || 0) + 1; return total;
  }, {});
  const origens = [...new Set(candidaturas.map(item => item.source).filter(Boolean))].sort();

  return (
    <aside className={`filters-panel ${abertoNoCelular ? "open" : ""}`}>
      <div className="filters-header">
        <div><span className="section-label">Pesquisa</span><h2>Filtros</h2></div>
        <div className="filters-header-actions"><button className="text-button" type="button" onClick={() => aoAlterar({ ...filtrosIniciais, ordenacao: filtros.ordenacao })}>Limpar tudo</button><button className="filter-close-button" type="button" onClick={aoFechar}><X /></button></div>
      </div>
      <label className="search-field"><Search /><input type="search" placeholder="Empresa, cargo ou tecnologia" value={filtros.busca} onChange={evento => alterar("busca", evento.target.value)} /></label>
      <GrupoFiltro titulo="Status" opcoes={STATUS} selecionadas={filtros.status} contagens={contar("status")} aoAlterar={valor => alterar("status", valor)} />
      <GrupoFiltro titulo="Modelo de trabalho" opcoes={MODELOS_TRABALHO} selecionadas={filtros.modelos} contagens={contar("workModel")} aoAlterar={valor => alterar("modelos", valor)} />
      <GrupoFiltro titulo="Tipo de contratação" opcoes={TIPOS_CONTRATACAO} selecionadas={filtros.contratacoes} contagens={contar("employmentType")} aoAlterar={valor => alterar("contratacoes", valor)} />
      <GrupoFiltro titulo="Prioridade" opcoes={PRIORIDADES} selecionadas={filtros.prioridades} contagens={contar("priority")} aoAlterar={valor => alterar("prioridades", valor)} />
      <GrupoFiltro titulo="Tecnologias" opcoes={tecnologias} selecionadas={filtros.tecnologias} contagens={contagemTecnologias} aoAlterar={valor => alterar("tecnologias", valor)} />
      <div className="filter-section select-filters">
        <label><span>Estado</span><select value={filtros.uf} onChange={evento => alterar("uf", evento.target.value)}><option value="todos">Todos os estados</option>{ESTADOS.map(uf => <option key={uf}>{uf}</option>)}</select></label>
        <label><span>Data de envio</span><select value={filtros.periodo} onChange={evento => alterar("periodo", evento.target.value)}><option value="todos">Qualquer período</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="ano">Este ano</option></select></label>
        <label><span>Origem</span><select value={filtros.origem} onChange={evento => alterar("origem", evento.target.value)}><option value="todos">Todas as origens</option>{origens.map(origem => <option key={origem}>{origem}</option>)}</select></label>
      </div>
      <div className="filter-section other-filters">
        <span className="filter-static-title">Outros</span>
        {([["comSalario", "Com salário informado"], ["comLink", "Com link da vaga"], ["somenteAtivas", "Somente processos ativos"]] as const).map(([campo, rotulo]) => (
          <label className="checkbox-item" key={campo}><input type="checkbox" checked={filtros[campo]} onChange={evento => alterar(campo, evento.target.checked)} /><span className="custom-checkbox"><Check /></span><span>{rotulo}</span></label>
        ))}
      </div>
    </aside>
  );
}
