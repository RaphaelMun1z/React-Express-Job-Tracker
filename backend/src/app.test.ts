import bcrypt from "bcryptjs";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { criarAplicacao } from "./app.js";
import type { Candidatura } from "./modelos/Candidatura.js";
import type { UsuarioComSenha } from "./modelos/Usuario.js";
import type { RepositorioCandidaturas } from "./repositorios/RepositorioCandidaturas.js";
import type { RepositorioUsuarios } from "./repositorios/RepositorioUsuarios.js";

class RepositorioCandidaturasEmMemoria implements RepositorioCandidaturas {
  private candidaturas: Array<Candidatura & { usuarioId: string }> = [];

  async listar(usuarioId?: string) {
    return this.candidaturas.filter(item => !usuarioId || item.usuarioId === usuarioId);
  }
  async buscarPorId(id: string, usuarioId?: string) {
    return this.candidaturas.find(
      item => item.id === id && (!usuarioId || item.usuarioId === usuarioId)
    );
  }
  async adicionar(candidatura: Candidatura, usuarioId: string) {
    const registro = { ...candidatura, usuarioId };
    this.candidaturas.unshift(registro);
    return registro;
  }
  async atualizar(candidatura: Candidatura) {
    this.candidaturas = this.candidaturas.map(item =>
      item.id === candidatura.id ? { ...item, ...candidatura } : item
    );
  }
  async remover(id: string, usuarioId?: string) {
    const quantidade = this.candidaturas.length;
    this.candidaturas = this.candidaturas.filter(
      item => item.id !== id || Boolean(usuarioId && item.usuarioId !== usuarioId)
    );
    return quantidade !== this.candidaturas.length;
  }
  async verificarConexao() {}
}

class RepositorioUsuariosEmMemoria implements RepositorioUsuarios {
  private usuarios: UsuarioComSenha[] = [
    {
      id: "admin", nome: "Administrador", email: "admin@teste.com",
      perfil: "ADMIN", ativo: true, senhaHash: bcrypt.hashSync("Admin@123", 4)
    },
    {
      id: "comum", nome: "Usuário", email: "usuario@teste.com",
      perfil: "USUARIO", ativo: true, senhaHash: bcrypt.hashSync("Usuario@123", 4)
    }
  ];
  async listar() {
    return this.usuarios.map(({ senhaHash: _, ...usuario }) => usuario);
  }
  async buscarPorEmail(email: string) {
    return this.usuarios.find(item => item.email === email);
  }
  async buscarPorId(id: string) {
    return this.usuarios.find(item => item.id === id);
  }
  async criar(dados: Omit<UsuarioComSenha, "id" | "ativo">) {
    const usuario = { ...dados, id: String(this.usuarios.length + 1), ativo: true };
    this.usuarios.push(usuario);
    const { senhaHash: _, ...publico } = usuario;
    return publico;
  }
  async atualizar(id: string, dados: Partial<UsuarioComSenha>) {
    const usuario = this.usuarios.find(item => item.id === id);
    if (!usuario) return undefined;
    Object.assign(usuario, dados);
    const { senhaHash: _, ativo: __, ...publico } = usuario;
    return publico;
  }
}

const dados = {
  company: "Empresa Teste", role: "Pessoa Desenvolvedora", status: "Aplicado",
  priority: "Alta", location: "São Paulo", stateCode: "SP",
  technologies: ["React"], workModel: "Remoto", employmentType: "CLT",
  source: "LinkedIn", link: "https://example.com/vaga",
  description: "Descrição da oportunidade", salary: "", benefits: "",
  applicationDate: "2026-06-28"
};

describe("API com autenticação e autorização", () => {
  let aplicacao: ReturnType<typeof criarAplicacao>;

  beforeEach(() => {
    aplicacao = criarAplicacao({
      candidaturas: new RepositorioCandidaturasEmMemoria(),
      usuarios: new RepositorioUsuariosEmMemoria()
    });
  });

  async function entrar(email: string, senha: string) {
    const resposta = await request(aplicacao)
      .post("/api/autenticacao/login")
      .send({ email, senha });
    return resposta.body.token as string;
  }

  it("rejeita acesso sem autenticação", async () => {
    expect((await request(aplicacao).get("/api/candidaturas")).status).toBe(401);
  });

  it("isola dados do usuário comum e permite visão completa ao administrador", async () => {
    const tokenUsuario = await entrar("usuario@teste.com", "Usuario@123");
    const tokenAdmin = await entrar("admin@teste.com", "Admin@123");
    await request(aplicacao).post("/api/candidaturas")
      .set("Authorization", `Bearer ${tokenUsuario}`).send(dados);
    await request(aplicacao).post("/api/candidaturas")
      .set("Authorization", `Bearer ${tokenAdmin}`).send({ ...dados, company: "Do Admin" });

    const listaUsuario = await request(aplicacao).get("/api/candidaturas")
      .set("Authorization", `Bearer ${tokenUsuario}`);
    const listaAdmin = await request(aplicacao).get("/api/candidaturas")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(listaUsuario.body).toHaveLength(1);
    expect(listaAdmin.body).toHaveLength(2);
  });

  it("executa o CRUD autenticado", async () => {
    const token = await entrar("usuario@teste.com", "Usuario@123");
    const autorizacao = { Authorization: `Bearer ${token}` };
    const criacao = await request(aplicacao).post("/api/candidaturas")
      .set(autorizacao).send(dados);
    expect(criacao.status).toBe(201);

    const atualizacao = await request(aplicacao)
      .put(`/api/candidaturas/${criacao.body.id}`)
      .set(autorizacao).send({ ...dados, status: "Entrevista" });
    expect(atualizacao.body.history).toHaveLength(2);
    expect((await request(aplicacao).delete(`/api/candidaturas/${criacao.body.id}`)
      .set(autorizacao)).status).toBe(204);
  });

  it("reserva o gerenciamento de usuários ao administrador", async () => {
    const tokenUsuario = await entrar("usuario@teste.com", "Usuario@123");
    const tokenAdmin = await entrar("admin@teste.com", "Admin@123");
    expect((await request(aplicacao).get("/api/usuarios")
      .set("Authorization", `Bearer ${tokenUsuario}`)).status).toBe(403);
    expect((await request(aplicacao).get("/api/usuarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)).status).toBe(200);
  });
});
