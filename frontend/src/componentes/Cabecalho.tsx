import { BriefcaseBusiness, FileSpreadsheet, LogOut, Menu, Plus, Users } from "lucide-react";
import { useState } from "react";
import type { Usuario } from "../modelos/Usuario";

interface Propriedades {
  aoCriar: () => void;
  aoExportarCsv: () => void;
  usuario: Usuario;
  aoSair: () => void;
  aoGerenciarUsuarios: () => void;
}

export function Cabecalho({ aoCriar, aoExportarCsv, usuario, aoSair, aoGerenciarUsuarios }: Propriedades) {
  const [aberto, definirAberto] = useState(false);
  const executar = (acao: () => void) => { definirAberto(false); acao(); };
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="TrackJobs">
        <span className="brand-icon"><BriefcaseBusiness /></span>
        <span><strong>TrackJobs</strong><small>Organizador de candidaturas</small></span>
      </a>
      <div className="navbar-menu-wrapper">
        <button className="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded={aberto} onClick={() => definirAberto(!aberto)}><Menu /></button>
        <nav className={`navbar-menu ${aberto ? "open" : ""}`} aria-hidden={!aberto}>
          <button className="navbar-menu-item primary-menu-item" type="button" onClick={() => executar(aoCriar)}><Plus /><span><strong>Nova candidatura</strong><small>Cadastrar um novo processo</small></span></button>
          <div className="navbar-menu-separator" />
          <button className="navbar-menu-item" type="button" onClick={() => executar(aoExportarCsv)}><FileSpreadsheet /><span><strong>Exportar planilha</strong><small>Baixar candidaturas em CSV</small></span></button>
          {usuario.perfil === "ADMIN" && <button className="navbar-menu-item" type="button" onClick={() => executar(aoGerenciarUsuarios)}><Users /><span><strong>Gerenciar usuários</strong><small>Criar e controlar acessos</small></span></button>}
          <div className="navbar-menu-separator" />
          <div className="user-menu-summary"><strong>{usuario.nome}</strong><small>{usuario.perfil === "ADMIN" ? "Administrador" : "Usuário comum"} · {usuario.email}</small></div>
          <button className="navbar-menu-item" type="button" onClick={() => executar(aoSair)}><LogOut /><span><strong>Sair</strong><small>Encerrar a sessão</small></span></button>
        </nav>
      </div>
    </header>
  );
}
