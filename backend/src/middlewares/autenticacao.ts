import type { NextFunction, Request, Response } from "express";
import type { ServicoAutenticacao } from "../servicos/ServicoAutenticacao.js";

export function exigirAutenticacao(servico: ServicoAutenticacao) {
  return async (requisicao: Request, resposta: Response, proximo: NextFunction) => {
    try {
      const cabecalho = requisicao.headers.authorization;
      if (!cabecalho?.startsWith("Bearer ")) {
        resposta.status(401).json({ mensagem: "Autenticação necessária." });
        return;
      }
      requisicao.usuario = await servico.identificar(cabecalho.slice(7));
      proximo();
    } catch {
      resposta.status(401).json({ mensagem: "Sessão inválida ou expirada." });
    }
  };
}

export function exigirAdministrador(
  requisicao: Request,
  resposta: Response,
  proximo: NextFunction
) {
  if (requisicao.usuario?.perfil !== "ADMIN") {
    resposta.status(403).json({ mensagem: "Acesso permitido somente para administradores." });
    return;
  }
  proximo();
}
