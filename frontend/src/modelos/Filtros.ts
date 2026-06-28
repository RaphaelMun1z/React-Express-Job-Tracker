export interface Filtros {
  busca: string;
  status: string[];
  modelos: string[];
  contratacoes: string[];
  prioridades: string[];
  tecnologias: string[];
  uf: string;
  origem: string;
  periodo: string;
  comSalario: boolean;
  comLink: boolean;
  somenteAtivas: boolean;
  ordenacao: string;
}

export const filtrosIniciais: Filtros = {
  busca: "",
  status: [],
  modelos: [],
  contratacoes: [],
  prioridades: [],
  tecnologias: [],
  uf: "todos",
  origem: "todos",
  periodo: "todos",
  comSalario: false,
  comLink: false,
  somenteAtivas: false,
  ordenacao: "updated-desc"
};
