import type { Request, Response } from "express";
import { ServicoAutenticacao } from "../servicos/ServicoAutenticacao.js";

export class ControladorAutenticacao {
  constructor(private readonly servico: ServicoAutenticacao) {}

  entrar = async (requisicao: Request, resposta: Response) => {
    try {
      const { email, senha } = requisicao.body as { email?: string; senha?: string };
      if (!email || !senha) {
        resposta.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
        return;
      }
      resposta.json(await this.servico.entrar(email, senha));
    } catch {
      resposta.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }
  };

  obterSessao = async (requisicao: Request, resposta: Response) => {
    resposta.json(requisicao.usuario);
  };
}
