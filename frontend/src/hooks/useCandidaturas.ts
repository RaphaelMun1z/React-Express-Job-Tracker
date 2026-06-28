import { useCallback, useEffect, useState } from "react";
import type { Candidatura, DadosCandidatura } from "../modelos/Candidatura";
import { apiCandidaturas } from "../servicos/apiCandidaturas";

export function useCandidaturas() {
  const [candidaturas, definirCandidaturas] = useState<Candidatura[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      definirCandidaturas(await apiCandidaturas.listar());
      definirErro("");
    } catch (falha) {
      definirErro((falha as Error).message);
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => { void carregar(); }, [carregar]);

  async function salvar(dados: DadosCandidatura, id?: string) {
    if (id) await apiCandidaturas.atualizar(id, dados);
    else await apiCandidaturas.criar(dados);
    await carregar();
  }

  async function remover(id: string) {
    await apiCandidaturas.remover(id);
    await carregar();
  }

  return { candidaturas, carregando, erro, salvar, remover };
}
