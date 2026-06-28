import "dotenv/config";
import { defineConfig } from "prisma/config";

const usuario = process.env.MYSQL_USER || "trackjobs";
const senha = process.env.MYSQL_PASSWORD || "trackjobs";
const servidor = process.env.MYSQL_HOST || "localhost";
const porta = process.env.MYSQL_PORT || "3306";
const banco = process.env.MYSQL_DATABASE || "trackjobs";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/seed.ts"
  },
  datasource: {
    url: process.env.DATABASE_URL || `mysql://${usuario}:${senha}@${servidor}:${porta}/${banco}`
  }
});
