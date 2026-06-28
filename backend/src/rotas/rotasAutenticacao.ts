import { Router } from "express";
import { ControladorAutenticacao } from "../controladores/ControladorAutenticacao.js";
import { exigirAutenticacao } from "../middlewares/autenticacao.js";
import { ServicoAutenticacao } from "../servicos/ServicoAutenticacao.js";

export function criarRotasAutenticacao(
  controlador: ControladorAutenticacao,
  servico: ServicoAutenticacao
) {
  const rotas = Router();
  rotas.post("/login", controlador.entrar);
  rotas.get("/sessao", exigirAutenticacao(servico), controlador.obterSessao);
  return rotas;
}
