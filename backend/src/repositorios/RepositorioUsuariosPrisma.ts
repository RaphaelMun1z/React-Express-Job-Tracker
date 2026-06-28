import type { PrismaClient } from "../generated/prisma/client.js";
import type {
  PerfilUsuario,
  UsuarioAutenticado,
  UsuarioComSenha
} from "../modelos/Usuario.js";
import type { RepositorioUsuarios } from "./RepositorioUsuarios.js";

export class RepositorioUsuariosPrisma implements RepositorioUsuarios {
  constructor(private readonly prisma: PrismaClient) {}

  async listar() {
    return this.prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, perfil: true, ativo: true },
      orderBy: { nome: "asc" }
    });
  }

  async buscarPorEmail(email: string): Promise<UsuarioComSenha | undefined> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });
    return usuario ? this.converterComSenha(usuario) : undefined;
  }

  async buscarPorId(id: string): Promise<UsuarioComSenha | undefined> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? this.converterComSenha(usuario) : undefined;
  }

  async criar(dados: {
    nome: string;
    email: string;
    senhaHash: string;
    perfil: PerfilUsuario;
  }): Promise<UsuarioAutenticado> {
    const usuario = await this.prisma.usuario.create({
      data: { ...dados, email: dados.email.toLowerCase() }
    });
    return this.converter(usuario);
  }

  async atualizar(
    id: string,
    dados: { nome?: string; perfil?: PerfilUsuario; ativo?: boolean; senhaHash?: string }
  ): Promise<UsuarioAutenticado | undefined> {
    const existente = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existente) return undefined;
    return this.converter(await this.prisma.usuario.update({ where: { id }, data: dados }));
  }

  private converter(usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: "ADMIN" | "USUARIO";
  }): UsuarioAutenticado {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    };
  }

  private converterComSenha(usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: "ADMIN" | "USUARIO";
    senhaHash: string;
    ativo: boolean;
  }): UsuarioComSenha {
    return { ...this.converter(usuario), senhaHash: usuario.senhaHash, ativo: usuario.ativo };
  }
}
