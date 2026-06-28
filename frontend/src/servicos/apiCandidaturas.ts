import type { Candidatura, DadosCandidatura } from "../modelos/Candidatura";
import { requisitar } from "./clienteHttp";

const ENDERECO = "/api/candidaturas";

export const apiCandidaturas = {
  listar: () => requisitar<Candidatura[]>(ENDERECO),
  criar: (dados: DadosCandidatura) => requisitar<Candidatura>(ENDERECO, {
    method: "POST",
    body: JSON.stringify(dados)
  }),
  atualizar: (id: string, dados: DadosCandidatura) => requisitar<Candidatura>(`${ENDERECO}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados)
  }),
  remover: (id: string) => requisitar<void>(`${ENDERECO}/${id}`, { method: "DELETE" })
};
