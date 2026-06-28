# TrackJobs

Organizador de candidaturas desenvolvido com React, Vite, TypeScript, Express,
Prisma ORM e MySQL.

## Executando em desenvolvimento

É necessário ter Node.js e Docker instalados:

```powershell
npm install
npm run dev
```

O comando inicia o MySQL pelo Docker, aplica as migrações do Prisma, cria os
usuários iniciais e executa:

- frontend: <http://localhost:5173>
- API: <http://localhost:3000>

## Usuários iniciais

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@trackjobs.local` | `Admin@123` |
| Usuário comum | `usuario@trackjobs.local` | `Usuario@123` |

Esses valores podem ser alterados em um arquivo `.env`, usando
[.env.example](./.env.example) como referência.

O administrador visualiza e gerencia todas as candidaturas. O usuário comum
visualiza e gerencia somente as candidaturas vinculadas à própria conta.

## Executando tudo no Docker

### Pré-requisitos

- Docker Desktop instalado e em execução;
- Docker Compose disponível (`docker compose version`);
- portas `5173`, `3000` e `3306` livres.

Não é necessário instalar Node.js para executar a aplicação inteiramente pelos
containers.

### Iniciar a aplicação

Na raiz do projeto, execute:

```powershell
npm run docker:up
```

Na primeira execução, o processo pode demorar enquanto as imagens são baixadas
e construídas. O Compose:

1. inicia o MySQL e aguarda o banco ficar saudável;
2. aplica as migrações do Prisma;
3. cria os usuários iniciais;
4. inicia a API Express;
5. inicia o frontend React servido pelo Nginx.

Quando todos os serviços estiverem saudáveis, acesse:

- aplicação: <http://localhost:5173>
- API: <http://localhost:3000>
- verificação da API: <http://localhost:3000/api/saude>

Para conferir o estado dos containers:

```powershell
docker compose ps
```

Para acompanhar os logs:

```powershell
docker compose logs -f
```

### Encerrar a aplicação

O comando abaixo encerra e remove os containers, preservando os dados do MySQL:

```powershell
npm run docker:down
```

Para remover também o volume e apagar todos os dados:

```powershell
docker compose down -v
```

Depois, a aplicação pode ser reconstruída normalmente:

```powershell
npm run docker:up
```

As portas, credenciais do MySQL, usuários iniciais e chave JWT podem ser
personalizados copiando `.env.example` para `.env` antes de iniciar os
containers.

## Estrutura

```text
frontend/src/
├── componentes/   # Telas e componentes React
├── contextos/     # Sessão autenticada
├── hooks/         # Estado das candidaturas
├── modelos/       # Tipos do frontend
├── servicos/      # Cliente HTTP e regras de consulta
└── utilitarios/

backend/
├── prisma/        # Schema e migrações do ORM
└── src/
    ├── configuracao/
    ├── controladores/
    ├── middlewares/
    ├── modelos/
    ├── repositorios/
    ├── rotas/
    └── servicos/
```

O schema possui as tabelas `usuarios` e `candidaturas`, relacionadas pela chave
estrangeira `candidaturas.usuario_id`.

## Comandos

```powershell
npm run dev
npm test
npm run build
npm start
npm run docker:up
npm run docker:down
```

## Endpoints principais

- `POST /api/autenticacao/login`
- `GET /api/autenticacao/sessao`
- `GET|POST /api/candidaturas`
- `PUT|DELETE /api/candidaturas/:id`
- `GET|POST|PATCH /api/usuarios` — somente administrador
- `GET /api/saude`

O projeto usa `compose.yaml` porque esse é o nome preferido pela especificação
atual do Docker Compose. `docker-compose.yml` continua aceito por
compatibilidade.
