import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const adaptador = new PrismaMariaDb({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "trackjobs",
  password: process.env.MYSQL_PASSWORD || "trackjobs",
  database: process.env.MYSQL_DATABASE || "trackjobs",
  connectionLimit: 10,
  connectTimeout: 5_000
});

export const prisma = new PrismaClient({ adapter: adaptador });
