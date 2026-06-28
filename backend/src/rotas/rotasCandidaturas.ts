import { Router } from "express";
import { ControladorCandidaturas } from "../controladores/ControladorCandidaturas.js";

export function criarRotasCandidaturas(controlador: ControladorCandidaturas) {
  const rotas = Router();
  rotas.get("/", controlador.listar);
  rotas.post("/", controlador.criar);
  rotas.put("/:id", controlador.atualizar);
  rotas.delete("/:id", controlador.remover);
  return rotas;
}
