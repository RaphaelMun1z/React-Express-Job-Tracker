export type PerfilUsuario = "ADMIN" | "USUARIO";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo?: boolean;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}
