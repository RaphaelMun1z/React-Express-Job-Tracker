import type { UsuarioAutenticado } from "../modelos/Usuario.js";

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export {};
