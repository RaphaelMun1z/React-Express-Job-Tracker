import type {
  PerfilUsuario,
  UsuarioAutenticado,
  UsuarioComSenha
} from "../modelos/Usuario.js";

export interface RepositorioUsuarios {
  listar(): Promise<Array<UsuarioAutenticado & { ativo: boolean }>>;
  buscarPorEmail(email: string): Promise<UsuarioComSenha | undefined>;
  buscarPorId(id: string): Promise<UsuarioComSenha | undefined>;
  criar(dados: {
    nome: string;
    email: string;
    senhaHash: string;
    perfil: PerfilUsuario;
  }): Promise<UsuarioAutenticado>;
  atualizar(
    id: string,
    dados: { nome?: string; perfil?: PerfilUsuario; ativo?: boolean; senhaHash?: string }
  ): Promise<UsuarioAutenticado | undefined>;
}
