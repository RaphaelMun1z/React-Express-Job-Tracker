import { Router } from "express";
import { ControladorUsuarios } from "../controladores/ControladorUsuarios.js";

export function criarRotasUsuarios(controlador: ControladorUsuarios) {
  const rotas = Router();
  rotas.get("/", controlador.listar);
  rotas.post("/", controlador.criar);
  rotas.patch("/:id", controlador.atualizar);
  return rotas;
}
