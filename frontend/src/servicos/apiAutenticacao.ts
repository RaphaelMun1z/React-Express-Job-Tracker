import type { Sessao, Usuario } from "../modelos/Usuario";
import { requisitar } from "./clienteHttp";

export const apiAutenticacao = {
  entrar: (email: string, senha: string) => requisitar<Sessao>("/api/autenticacao/login", {
    method: "POST",
    body: JSON.stringify({ email, senha })
  }),
  obterSessao: () => requisitar<Usuario>("/api/autenticacao/sessao")
};
