import { STATUS } from "../configuracao";
import type { Candidatura } from "../modelos/Candidatura";
import type { Filtros } from "../modelos/Filtros";

const normalizar = (valor: string) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const dataLocal = (valor: string) => new Date(`${valor}T12:00:00`);

export function filtrarCandidaturas(candidaturas: Candidatura[], filtros: Filtros) {
  const busca = normalizar(filtros.busca);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inclui = (selecionados: string[], valor: string) => !selecionados.length || selecionados.includes(valor);

  const resultado = candidaturas.filter(candidatura => {
    const campos = [candidatura.company, candidatura.role, candidatura.description, candidatura.location, candidatura.source, ...candidatura.technologies];
    const atendePeriodo = filtros.periodo === "todos"
      || (filtros.periodo === "ano"
        ? dataLocal(candidatura.applicationDate).getFullYear() === hoje.getFullYear()
        : dataLocal(candidatura.applicationDate) >= new Date(hoje.getTime() - Number(filtros.periodo) * 86400000));
    return (!busca || campos.some(campo => normalizar(campo).includes(busca)))
      && inclui(filtros.status, candidatura.status)
      && inclui(filtros.modelos, candidatura.workModel)
      && inclui(filtros.contratacoes, candidatura.employmentType)
      && inclui(filtros.prioridades, candidatura.priority)
      && (!filtros.tecnologias.length || filtros.tecnologias.every(item => candidatura.technologies.includes(item)))
      && (filtros.uf === "todos" || candidatura.stateCode === filtros.uf)
      && (filtros.origem === "todos" || candidatura.source === filtros.origem)
      && (!filtros.comSalario || Boolean(candidatura.salary))
      && (!filtros.comLink || Boolean(candidatura.link))
      && (!filtros.somenteAtivas || !["Rejeitado", "Proposta"].includes(candidatura.status))
      && atendePeriodo;
  });

  const ordemStatus = Object.fromEntries(STATUS.map((item, indice) => [item, indice]));
  const ordemPrioridade: Record<string, number> = { Alta: 0, Média: 1, Baixa: 2 };
  const recente = (a: Candidatura, b: Candidatura) => +new Date(b.updatedAt) - +new Date(a.updatedAt);
  const ordenadores: Record<string, (a: Candidatura, b: Candidatura) => number> = {
    "updated-desc": recente,
    "application-desc": (a, b) => +dataLocal(b.applicationDate) - +dataLocal(a.applicationDate),
    "company-asc": (a, b) => a.company.localeCompare(b.company, "pt-BR"),
    priority: (a, b) => ordemPrioridade[a.priority]! - ordemPrioridade[b.priority]! || recente(a, b),
    status: (a, b) => ordemStatus[a.status]! - ordemStatus[b.status]! || recente(a, b)
  };
  return [...resultado].sort(ordenadores[filtros.ordenacao] || recente);
}
