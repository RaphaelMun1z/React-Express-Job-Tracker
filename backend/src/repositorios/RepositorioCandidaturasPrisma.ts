import type { PrismaClient } from "../generated/prisma/client.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { Candidatura, ItemHistorico } from "../modelos/Candidatura.js";
import type { RepositorioCandidaturas } from "./RepositorioCandidaturas.js";

const incluirProprietario = {
  usuario: { select: { id: true, nome: true, email: true } }
} as const;

type RegistroComUsuario = Prisma.CandidaturaGetPayload<{
  include: typeof incluirProprietario;
}>;

export class RepositorioCandidaturasPrisma implements RepositorioCandidaturas {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(usuarioId?: string): Promise<Candidatura[]> {
    const registros = await this.prisma.candidatura.findMany({
      where: usuarioId ? { usuarioId } : undefined,
      include: incluirProprietario,
      orderBy: { atualizadoEm: "desc" }
    });
    return registros.map(registro => this.converter(registro));
  }

  async buscarPorId(id: string, usuarioId?: string): Promise<Candidatura | undefined> {
    const registro = await this.prisma.candidatura.findFirst({
      where: { id, ...(usuarioId ? { usuarioId } : {}) },
      include: incluirProprietario
    });
    return registro ? this.converter(registro) : undefined;
  }

  async adicionar(candidatura: Candidatura, usuarioId: string): Promise<Candidatura> {
    const registro = await this.prisma.candidatura.create({
      data: this.paraPersistencia(candidatura, usuarioId),
      include: incluirProprietario
    });
    return this.converter(registro);
  }

  async atualizar(candidatura: Candidatura): Promise<void> {
    await this.prisma.candidatura.update({
      where: { id: candidatura.id },
      data: {
        empresa: candidatura.company,
        cargo: candidatura.role,
        status: candidatura.status,
        prioridade: candidatura.priority,
        localizacao: candidatura.location,
        uf: candidatura.stateCode,
        tecnologias: candidatura.technologies,
        modeloTrabalho: candidatura.workModel,
        tipoContratacao: candidatura.employmentType,
        origem: candidatura.source,
        link: candidatura.link,
        descricao: candidatura.description,
        salario: candidatura.salary,
        beneficios: candidatura.benefits,
        dataCandidatura: new Date(`${candidatura.applicationDate}T12:00:00Z`),
        historico: candidatura.history as unknown as Prisma.InputJsonValue
      }
    });
  }

  async remover(id: string, usuarioId?: string): Promise<boolean> {
    const resultado = await this.prisma.candidatura.deleteMany({
      where: { id, ...(usuarioId ? { usuarioId } : {}) }
    });
    return resultado.count > 0;
  }

  async verificarConexao(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  private paraPersistencia(
    candidatura: Candidatura,
    usuarioId: string
  ): Prisma.CandidaturaUncheckedCreateInput {
    return {
      id: candidatura.id,
      empresa: candidatura.company,
      cargo: candidatura.role,
      status: candidatura.status,
      prioridade: candidatura.priority,
      localizacao: candidatura.location,
      uf: candidatura.stateCode,
      tecnologias: candidatura.technologies,
      modeloTrabalho: candidatura.workModel,
      tipoContratacao: candidatura.employmentType,
      origem: candidatura.source,
      link: candidatura.link,
      descricao: candidatura.description,
      salario: candidatura.salary,
      beneficios: candidatura.benefits,
      dataCandidatura: new Date(`${candidatura.applicationDate}T12:00:00Z`),
      criadoEm: new Date(candidatura.createdAt),
      atualizadoEm: new Date(candidatura.updatedAt),
      historico: candidatura.history as unknown as Prisma.InputJsonValue,
      usuarioId
    };
  }

  private converter(registro: RegistroComUsuario): Candidatura {
    return {
      id: registro.id,
      company: registro.empresa,
      role: registro.cargo,
      status: registro.status,
      priority: registro.prioridade,
      location: registro.localizacao,
      stateCode: registro.uf,
      technologies: registro.tecnologias as string[],
      workModel: registro.modeloTrabalho,
      employmentType: registro.tipoContratacao,
      source: registro.origem,
      link: registro.link,
      description: registro.descricao,
      salary: registro.salario,
      benefits: registro.beneficios,
      applicationDate: registro.dataCandidatura.toISOString().slice(0, 10),
      createdAt: registro.criadoEm.toISOString(),
      updatedAt: registro.atualizadoEm.toISOString(),
      history: registro.historico as unknown as ItemHistorico[],
      owner: {
        id: registro.usuario.id,
        name: registro.usuario.nome,
        email: registro.usuario.email
      }
    };
  }
}
