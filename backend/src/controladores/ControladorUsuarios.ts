import type { Request, Response } from "express";
import type { PerfilUsuario } from "../modelos/Usuario.js";
import { ServicoUsuarios } from "../servicos/ServicoUsuarios.js";

export class ControladorUsuarios {
  constructor(private readonly servico: ServicoUsuarios) {}

  listar = async (_requisicao: Request, resposta: Response) => {
    resposta.json(await this.servico.listar());
  };

  criar = async (requisicao: Request, resposta: Response) => {
    const dados = requisicao.body as {
      nome: string;
      email: string;
      senha: string;
      perfil: PerfilUsuario;
    };
    resposta.status(201).json(await this.servico.criar(dados));
  };

  atualizar = async (requisicao: Request, resposta: Response) => {
    resposta.json(await this.servico.atualizar(
      String(requisicao.params.id),
      requisicao.body
    ));
  };
}
