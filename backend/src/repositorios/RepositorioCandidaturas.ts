import type { Candidatura } from "../modelos/Candidatura.js";

export interface RepositorioCandidaturas {
  listar(usuarioId?: string): Promise<Candidatura[]>;
  buscarPorId(id: string, usuarioId?: string): Promise<Candidatura | undefined>;
  adicionar(candidatura: Candidatura, usuarioId: string): Promise<Candidatura>;
  atualizar(candidatura: Candidatura): Promise<void>;
  remover(id: string, usuarioId?: string): Promise<boolean>;
  verificarConexao(): Promise<void>;
}
