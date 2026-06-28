# syntax=docker/dockerfile:1

FROM node:24-alpine AS dependencias
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY backend ./backend

FROM dependencias AS migracoes
WORKDIR /app/backend
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed"]

FROM dependencias AS compilacao
WORKDIR /app
RUN npm run build -w backend

FROM node:24-alpine AS producao
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci --omit=dev --omit=optional --workspace backend --include-workspace-root=false \
    && npm cache clean --force

COPY --from=compilacao /app/backend/dist ./backend/dist
COPY --from=compilacao /app/backend/prisma ./backend/prisma
COPY --from=compilacao /app/backend/prisma.config.ts ./backend/prisma.config.ts

WORKDIR /app/backend
USER node
EXPOSE 3000
CMD ["node", "dist/servidor.js"]
