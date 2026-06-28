import { Plus, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PerfilUsuario, Usuario } from "../modelos/Usuario";
import { apiUsuarios } from "../servicos/apiUsuarios";

export function GerenciadorUsuarios({
  usuarioAtual,
  aoFechar
}: {
  usuarioAtual: Usuario;
  aoFechar: () => void;
}) {
  const [usuarios, definirUsuarios] = useState<Usuario[]>([]);
  const [nome, definirNome] = useState("");
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [perfil, definirPerfil] = useState<PerfilUsuario>("USUARIO");
  const [erro, definirErro] = useState("");

  async function carregar() {
    try {
      definirUsuarios(await apiUsuarios.listar());
      definirErro("");
    } catch (falha) {
      definirErro((falha as Error).message);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function criar(evento: React.FormEvent) {
    evento.preventDefault();
    try {
      await apiUsuarios.criar({ nome, email, senha, perfil });
      definirNome(""); definirEmail(""); definirSenha(""); definirPerfil("USUARIO");
      await carregar();
    } catch (falha) {
      definirErro((falha as Error).message);
    }
  }

  async function atualizar(id: string, dados: { perfil?: PerfilUsuario; ativo?: boolean }) {
    try {
      await apiUsuarios.atualizar(id, dados);
      await carregar();
    } catch (falha) {
      definirErro((falha as Error).message);
    }
  }

  return (
    <div className="modal-backdrop open" onMouseDown={evento => evento.target === evento.currentTarget && aoFechar()}>
      <section className="modal-card users-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div><span className="section-label">Administração</span><h2>Gerenciar usuários</h2></div>
          <button className="icon-button" onClick={aoFechar}><X /></button>
        </div>
        <div className="users-body">
          <form className="user-create-form" onSubmit={criar}>
            <h3>Novo usuário</h3>
            <div className="form-grid">
              <label><span>Nome *</span><input required value={nome} onChange={evento => definirNome(evento.target.value)} /></label>
              <label><span>E-mail *</span><input type="email" required value={email} onChange={evento => definirEmail(evento.target.value)} /></label>
              <label><span>Senha *</span><input type="password" minLength={8} required value={senha} onChange={evento => definirSenha(evento.target.value)} /></label>
              <label><span>Perfil</span><select value={perfil} onChange={evento => definirPerfil(evento.target.value as PerfilUsuario)}><option value="USUARIO">Usuário comum</option><option value="ADMIN">Administrador</option></select></label>
            </div>
            <button className="primary-button"><Plus />Adicionar usuário</button>
          </form>
          {erro && <p className="login-error">{erro}</p>}
          <section className="users-list">
            <h3>Usuários cadastrados</h3>
            {usuarios.map(usuario => {
              const ehAtual = usuario.id === usuarioAtual.id;
              return (
                <article className="user-row" key={usuario.id}>
                  <span className="user-avatar">{usuario.perfil === "ADMIN" ? <ShieldCheck /> : <UserRound />}</span>
                  <div><strong>{usuario.nome}</strong><small>{usuario.email}</small></div>
                  <select aria-label="Perfil" value={usuario.perfil} disabled={ehAtual} onChange={evento => atualizar(usuario.id, { perfil: evento.target.value as PerfilUsuario })}><option value="USUARIO">Usuário</option><option value="ADMIN">Admin</option></select>
                  <button className={usuario.ativo ? "secondary-button" : "primary-button"} disabled={ehAtual} onClick={() => atualizar(usuario.id, { ativo: !usuario.ativo })}>{usuario.ativo ? "Desativar" : "Ativar"}</button>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </div>
  );
}
