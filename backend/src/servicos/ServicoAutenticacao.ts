import bcrypt from "bcryptjs";
import type { UsuarioAutenticado } from "../modelos/Usuario.js";
import type { RepositorioUsuarios } from "../repositorios/RepositorioUsuarios.js";
import { ServicoToken } from "./ServicoToken.js";

export class ServicoAutenticacao {
  constructor(
    private readonly repositorio: RepositorioUsuarios,
    private readonly tokens: ServicoToken
  ) {}

  async entrar(email: string, senha: string) {
    const usuario = await this.repositorio.buscarPorEmail(email.trim().toLowerCase());
    if (!usuario || !usuario.ativo || !await bcrypt.compare(senha, usuario.senhaHash)) {
      throw new Error("E-mail ou senha inválidos.");
    }
    const publico = this.removerDadosSensiveis(usuario);
    return { token: this.tokens.gerar(publico), usuario: publico };
  }

  async identificar(token: string): Promise<UsuarioAutenticado> {
    const { id } = this.tokens.verificar(token);
    const usuario = await this.repositorio.buscarPorId(id);
    if (!usuario || !usuario.ativo) throw new Error("Usuário não autorizado.");
    return this.removerDadosSensiveis(usuario);
  }

  private removerDadosSensiveis(usuario: UsuarioAutenticado): UsuarioAutenticado {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    };
  }
}
