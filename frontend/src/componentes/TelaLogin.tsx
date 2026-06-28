import { BriefcaseBusiness, LogIn } from "lucide-react";
import { useState } from "react";

export function TelaLogin({
  aoEntrar
}: {
  aoEntrar: (email: string, senha: string) => Promise<void>;
}) {
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    definirEnviando(true);
    definirErro("");
    try {
      await aoEntrar(email, senha);
    } catch (falha) {
      definirErro((falha as Error).message);
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="brand-icon"><BriefcaseBusiness /></span>
          <div><strong>TrackJobs</strong><small>Organizador de candidaturas</small></div>
        </div>
        <div className="login-heading">
          <span className="section-label">Acesso ao sistema</span>
          <h1>Entre na sua conta</h1>
          <p>Suas candidaturas ficam protegidas e vinculadas ao seu usuário.</p>
        </div>
        <form className="login-form" onSubmit={enviar}>
          <label><span>E-mail</span><input type="email" autoComplete="username" required value={email} onChange={evento => definirEmail(evento.target.value)} placeholder="voce@email.com" /></label>
          <label><span>Senha</span><input type="password" autoComplete="current-password" required value={senha} onChange={evento => definirSenha(evento.target.value)} placeholder="Sua senha" /></label>
          {erro && <p className="login-error">{erro}</p>}
          <button className="primary-button" disabled={enviando}><LogIn />{enviando ? "Entrando..." : "Entrar"}</button>
        </form>
      </section>
    </main>
  );
}
