import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProvedorSessao } from "./contextos/ContextoSessao";
import { Sistema } from "./Sistema";
import "./estilos.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProvedorSessao>
      <Sistema />
    </ProvedorSessao>
  </StrictMode>
);
