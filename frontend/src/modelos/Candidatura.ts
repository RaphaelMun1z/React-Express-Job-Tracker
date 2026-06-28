export interface ItemHistorico {
  status: string;
  date: string;
}

export interface Candidatura {
  id: string;
  company: string;
  role: string;
  status: string;
  priority: string;
  location: string;
  stateCode: string;
  technologies: string[];
  workModel: string;
  employmentType: string;
  source: string;
  link: string;
  description: string;
  salary: string;
  benefits: string;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  history: ItemHistorico[];
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export type DadosCandidatura = Omit<
  Candidatura,
  "id" | "createdAt" | "updatedAt" | "history"
>;
