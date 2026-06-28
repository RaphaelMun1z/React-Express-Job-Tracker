import jwt from "jsonwebtoken";
import type { UsuarioAutenticado } from "../modelos/Usuario.js";

export class ServicoToken {
  private readonly segredo = process.env.JWT_SECRET
    || "trackjobs-chave-local-altere-em-producao";

  gerar(usuario: UsuarioAutenticado) {
    return jwt.sign(
      { nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
      this.segredo,
      {
        subject: usuario.id,
        issuer: "trackjobs",
        audience: "trackjobs-web",
        expiresIn: "8h"
      }
    );
  }

  verificar(token: string): { id: string } {
    const conteudo = jwt.verify(token, this.segredo, {
      issuer: "trackjobs",
      audience: "trackjobs-web"
    });
    if (typeof conteudo === "string" || !conteudo.sub) {
      throw new Error("Token inválido.");
    }
    return { id: conteudo.sub };
  }
}
