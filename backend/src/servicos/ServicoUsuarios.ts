import bcrypt from "bcryptjs";
import type { PerfilUsuario } from "../modelos/Usuario.js";
import type { RepositorioUsuarios } from "../repositorios/RepositorioUsuarios.js";

export class ServicoUsuarios {
  constructor(private readonly repositorio: RepositorioUsuarios) {}

  listar() {
    return this.repositorio.listar();
  }

  async criar(dados: {
    nome: string;
    email: string;
    senha: string;
    perfil: PerfilUsuario;
  }) {
    if (!dados.nome?.trim() || !dados.email?.trim() || dados.senha?.length < 8) {
      throw new Error("Nome, e-mail e senha com ao menos 8 caracteres são obrigatórios.");
    }
    if (await this.repositorio.buscarPorEmail(dados.email)) {
      throw new Error("Já existe um usuário com este e-mail.");
    }
    return this.repositorio.criar({
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      senhaHash: await bcrypt.hash(dados.senha, 12),
      perfil: dados.perfil === "ADMIN" ? "ADMIN" : "USUARIO"
    });
  }

  async atualizar(
    id: string,
    dados: { nome?: string; perfil?: PerfilUsuario; ativo?: boolean; senha?: string }
  ) {
    const senhaHash = dados.senha ? await bcrypt.hash(dados.senha, 12) : undefined;
    const usuario = await this.repositorio.atualizar(id, {
      nome: dados.nome?.trim(),
      perfil: dados.perfil,
      ativo: dados.ativo,
      senhaHash
    });
    if (!usuario) throw new Error("Usuário não encontrado.");
    return usuario;
  }
}
