export type PerfilUsuario = "ADMIN" | "USUARIO";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface UsuarioComSenha extends UsuarioAutenticado {
  senhaHash: string;
  ativo: boolean;
}
