import type { NextFunction, Request, Response } from "express";
import type { DadosCandidatura } from "../modelos/Candidatura.js";
import { ServicoCandidaturas } from "../servicos/ServicoCandidaturas.js";

export class ControladorCandidaturas {
  constructor(private readonly servico: ServicoCandidaturas) {}

  listar = async (requisicao: Request, resposta: Response) => {
    resposta.json(await this.servico.listar(requisicao.usuario!));
  };

  criar = async (requisicao: Request, resposta: Response) => {
    const dados = requisicao.body as DadosCandidatura;
    this.validar(dados);
    resposta.status(201).json(await this.servico.criar(dados, requisicao.usuario!));
  };

  atualizar = async (requisicao: Request, resposta: Response) => {
    const dados = requisicao.body as DadosCandidatura;
    this.validar(dados);
    const candidatura = await this.servico.atualizar(
      String(requisicao.params.id),
      dados,
      requisicao.usuario!
    );
    if (!candidatura) {
      resposta.status(404).json({ mensagem: "Candidatura não encontrada." });
      return;
    }
    resposta.json(candidatura);
  };

  remover = async (requisicao: Request, resposta: Response) => {
    const removeu = await this.servico.remover(
      String(requisicao.params.id),
      requisicao.usuario!
    );
    if (!removeu) {
      resposta.status(404).json({ mensagem: "Candidatura não encontrada." });
      return;
    }
    resposta.status(204).send();
  };

  tratarErro = (
    erro: Error,
    _requisicao: Request,
    resposta: Response,
    _proximo: NextFunction
  ) => {
    resposta.status(400).json({ mensagem: erro.message || "Não foi possível concluir a operação." });
  };

  private validar(dados: DadosCandidatura) {
    if (!dados?.company?.trim() || !dados?.role?.trim() || !dados?.description?.trim()) {
      throw new Error("Empresa, cargo e descrição são obrigatórios.");
    }
    if (!dados.applicationDate) throw new Error("A data de envio é obrigatória.");
    if (dados.link) {
      const endereco = new URL(dados.link);
      if (!["http:", "https:"].includes(endereco.protocol)) {
        throw new Error("O link da vaga deve usar HTTP ou HTTPS.");
      }
    }
  }
}
