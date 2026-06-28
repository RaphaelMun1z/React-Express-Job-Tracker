import type { PerfilUsuario, Usuario } from "../modelos/Usuario";
import { requisitar } from "./clienteHttp";

export const apiUsuarios = {
  listar: () => requisitar<Usuario[]>("/api/usuarios"),
  criar: (dados: {
    nome: string;
    email: string;
    senha: string;
    perfil: PerfilUsuario;
  }) => requisitar<Usuario>("/api/usuarios", {
    method: "POST",
    body: JSON.stringify(dados)
  }),
  atualizar: (
    id: string,
    dados: { nome?: string; perfil?: PerfilUsuario; ativo?: boolean; senha?: string }
  ) => requisitar<Usuario>(`/api/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados)
  })
};
