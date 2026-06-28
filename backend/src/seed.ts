import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./generated/prisma/client.js";

const adaptador = new PrismaMariaDb({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "trackjobs",
  password: process.env.MYSQL_PASSWORD || "trackjobs",
  database: process.env.MYSQL_DATABASE || "trackjobs",
  connectionLimit: 2
});
const prisma = new PrismaClient({ adapter: adaptador });

async function criarUsuarioInicial(
  nome: string,
  email: string,
  senha: string,
  perfil: "ADMIN" | "USUARIO"
) {
  await prisma.usuario.upsert({
    where: { email },
    update: { nome, perfil, ativo: true },
    create: {
      nome,
      email,
      senhaHash: await bcrypt.hash(senha, 12),
      perfil
    }
  });
}

async function executar() {
  await criarUsuarioInicial(
    "Administrador",
    process.env.ADMIN_EMAIL || "admin@trackjobs.local",
    process.env.ADMIN_PASSWORD || "Admin@123",
    "ADMIN"
  );
  await criarUsuarioInicial(
    "Usuário de demonstração",
    process.env.USER_EMAIL || "usuario@trackjobs.local",
    process.env.USER_PASSWORD || "Usuario@123",
    "USUARIO"
  );
}

executar()
  .then(() => console.log("Usuários iniciais verificados."))
  .finally(() => prisma.$disconnect());
