import cors from "cors";
import express from "express";
import path from "node:path";
import { prisma } from "./configuracao/prisma.js";
import { ControladorAutenticacao } from "./controladores/ControladorAutenticacao.js";
import { ControladorCandidaturas } from "./controladores/ControladorCandidaturas.js";
import { ControladorUsuarios } from "./controladores/ControladorUsuarios.js";
import { exigirAdministrador, exigirAutenticacao } from "./middlewares/autenticacao.js";
import type { RepositorioCandidaturas } from "./repositorios/RepositorioCandidaturas.js";
import { RepositorioCandidaturasPrisma } from "./repositorios/RepositorioCandidaturasPrisma.js";
import type { RepositorioUsuarios } from "./repositorios/RepositorioUsuarios.js";
import { RepositorioUsuariosPrisma } from "./repositorios/RepositorioUsuariosPrisma.js";
import { criarRotasAutenticacao } from "./rotas/rotasAutenticacao.js";
import { criarRotasCandidaturas } from "./rotas/rotasCandidaturas.js";
import { criarRotasUsuarios } from "./rotas/rotasUsuarios.js";
import { ServicoAutenticacao } from "./servicos/ServicoAutenticacao.js";
import { ServicoCandidaturas } from "./servicos/ServicoCandidaturas.js";
import { ServicoToken } from "./servicos/ServicoToken.js";
import { ServicoUsuarios } from "./servicos/ServicoUsuarios.js";

interface Dependencias {
  candidaturas: RepositorioCandidaturas;
  usuarios: RepositorioUsuarios;
}

export function criarAplicacao(dependencias: Dependencias = {
  candidaturas: new RepositorioCandidaturasPrisma(prisma),
  usuarios: new RepositorioUsuariosPrisma(prisma)
}) {
  const servicoAutenticacao = new ServicoAutenticacao(
    dependencias.usuarios,
    new ServicoToken()
  );
  const controladorAutenticacao = new ControladorAutenticacao(servicoAutenticacao);
  const controladorCandidaturas = new ControladorCandidaturas(
    new ServicoCandidaturas(dependencias.candidaturas)
  );
  const controladorUsuarios = new ControladorUsuarios(
    new ServicoUsuarios(dependencias.usuarios)
  );
  const aplicacao = express();

  aplicacao.use(cors({ origin: "http://localhost:5173" }));
  aplicacao.use(express.json({ limit: "2mb" }));
  aplicacao.get("/api/saude", async (_requisicao, resposta) => {
    await dependencias.candidaturas.verificarConexao();
    resposta.json({ status: "ok", banco: "conectado" });
  });
  aplicacao.use(
    "/api/autenticacao",
    criarRotasAutenticacao(controladorAutenticacao, servicoAutenticacao)
  );
  aplicacao.use(
    "/api/candidaturas",
    exigirAutenticacao(servicoAutenticacao),
    criarRotasCandidaturas(controladorCandidaturas)
  );
  aplicacao.use(
    "/api/usuarios",
    exigirAutenticacao(servicoAutenticacao),
    exigirAdministrador,
    criarRotasUsuarios(controladorUsuarios)
  );
  aplicacao.use(express.static(path.resolve("../frontend/dist")));
  aplicacao.use(controladorCandidaturas.tratarErro);

  return aplicacao;
}
