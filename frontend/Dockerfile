# syntax=docker/dockerfile:1

FROM node:24-alpine AS compilacao
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY frontend ./frontend
RUN npm run build -w frontend

FROM nginx:stable-alpine3.23 AS producao
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compilacao /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
