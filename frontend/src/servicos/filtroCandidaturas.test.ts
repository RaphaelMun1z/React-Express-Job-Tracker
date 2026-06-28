import { describe, expect, it } from "vitest";
import type { Candidatura } from "../modelos/Candidatura";
import { filtrosIniciais } from "../modelos/Filtros";
import { filtrarCandidaturas } from "./filtroCandidaturas";

const candidatura = {
  id: "1", company: "Empresa Ágil", role: "Desenvolvedor React", status: "Entrevista",
  priority: "Alta", location: "São Paulo", stateCode: "SP", technologies: ["React", "TypeScript"],
  workModel: "Remoto", employmentType: "CLT", source: "LinkedIn", link: "",
  description: "Aplicação web", salary: "", benefits: "", applicationDate: "2026-06-20",
  createdAt: "2026-06-20T10:00:00Z", updatedAt: "2026-06-20T10:00:00Z", history: []
} satisfies Candidatura;

describe("filtro de candidaturas", () => {
  it("pesquisa sem diferenciar acentos", () => {
    expect(filtrarCandidaturas([candidatura], { ...filtrosIniciais, busca: "agil" })).toHaveLength(1);
  });

  it("exige todas as tecnologias selecionadas", () => {
    expect(filtrarCandidaturas([candidatura], { ...filtrosIniciais, tecnologias: ["React", "Java"] })).toHaveLength(0);
  });
});
