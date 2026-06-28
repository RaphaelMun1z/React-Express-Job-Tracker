import { randomUUID } from "node:crypto";
import type { Candidatura, DadosCandidatura } from "../modelos/Candidatura.js";
import type { RepositorioCandidaturas } from "../repositorios/RepositorioCandidaturas.js";
import type { UsuarioAutenticado } from "../modelos/Usuario.js";

export class ServicoCandidaturas {
  constructor(private readonly repositorio: RepositorioCandidaturas) {}

  listar(usuario: UsuarioAutenticado) {
    return this.repositorio.listar(this.obterEscopo(usuario));
  }

  async criar(
    dados: DadosCandidatura,
    usuario: UsuarioAutenticado
  ): Promise<Candidatura> {
    const agora = new Date().toISOString();
    const candidatura: Candidatura = {
      ...this.normalizar(dados),
      id: `app-${randomUUID()}`,
      createdAt: agora,
      updatedAt: agora,
      history: [{ status: dados.status, date: agora }]
    };
    return this.repositorio.adicionar(candidatura, usuario.id);
  }

  async atualizar(
    id: string,
    dados: DadosCandidatura,
    usuario: UsuarioAutenticado
  ): Promise<Candidatura | null> {
    const atual = await this.repositorio.buscarPorId(id, this.obterEscopo(usuario));
    if (!atual) return null;
    const agora = new Date().toISOString();
    const historico = atual.status === dados.status
      ? atual.history
      : [...atual.history, { status: dados.status, date: agora }];
    const candidatura = {
      ...atual,
      ...this.normalizar(dados),
      updatedAt: agora,
      history: historico
    };
    await this.repositorio.atualizar(candidatura);
    return candidatura;
  }

  remover(id: string, usuario: UsuarioAutenticado) {
    return this.repositorio.remover(id, this.obterEscopo(usuario));
  }

  private normalizar(dados: DadosCandidatura): DadosCandidatura {
    return {
      company: String(dados.company || "").trim(),
      role: String(dados.role || "").trim(),
      status: dados.status || "Aplicado",
      priority: dados.priority || "Média",
      location: String(dados.location || "").trim(),
      stateCode: String(dados.stateCode || "").trim().toUpperCase(),
      technologies: [...new Set((dados.technologies || []).map(item => item.trim()).filter(Boolean))],
      workModel: String(dados.workModel || "").trim(),
      employmentType: String(dados.employmentType || "").trim(),
      source: String(dados.source || "").trim(),
      link: String(dados.link || "").trim(),
      description: String(dados.description || "").trim(),
      salary: String(dados.salary || "").trim(),
      benefits: String(dados.benefits || "").trim(),
      applicationDate: dados.applicationDate
    };
  }

  private obterEscopo(usuario: UsuarioAutenticado) {
    return usuario.perfil === "ADMIN" ? undefined : usuario.id;
  }
}
