import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Usuario } from "../modelos/Usuario";
import { apiAutenticacao } from "../servicos/apiAutenticacao";
import { armazenamentoToken } from "../servicos/clienteHttp";

interface EstadoSessao {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const ContextoSessao = createContext<EstadoSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [usuario, definirUsuario] = useState<Usuario | null>(null);
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    async function restaurar() {
      if (!armazenamentoToken.obter()) {
        definirCarregando(false);
        return;
      }
      try {
        definirUsuario(await apiAutenticacao.obterSessao());
      } catch {
        armazenamentoToken.remover();
      } finally {
        definirCarregando(false);
      }
    }
    void restaurar();
    const expirar = () => definirUsuario(null);
    window.addEventListener("sessao-expirada", expirar);
    return () => window.removeEventListener("sessao-expirada", expirar);
  }, []);

  async function entrar(email: string, senha: string) {
    const sessao = await apiAutenticacao.entrar(email, senha);
    armazenamentoToken.salvar(sessao.token);
    definirUsuario(sessao.usuario);
  }

  function sair() {
    armazenamentoToken.remover();
    definirUsuario(null);
  }

  return (
    <ContextoSessao.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </ContextoSessao.Provider>
  );
}

export function useSessao() {
  const contexto = useContext(ContextoSessao);
  if (!contexto) throw new Error("useSessao deve estar dentro do ProvedorSessao.");
  return contexto;
}
