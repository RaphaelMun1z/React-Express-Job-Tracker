import { Aplicacao } from "./Aplicacao";
import { TelaLogin } from "./componentes/TelaLogin";
import { useSessao } from "./contextos/ContextoSessao";

export function Sistema() {
  const { usuario, carregando, entrar, sair } = useSessao();
  if (carregando) return <main className="login-page"><p>Verificando sessão...</p></main>;
  if (!usuario) return <TelaLogin aoEntrar={entrar} />;
  return <Aplicacao usuario={usuario} aoSair={sair} />;
}
