# Nest Clean - Forum API

API de forum construida com NestJS seguindo os principios de **Clean Architecture**, **DDD** e **Event-Driven Architecture**.

## Tech Stack

- **Framework:** NestJS 11
- **Linguagem:** TypeScript 5.7
- **Banco de dados:** PostgreSQL 16 + Prisma ORM
- **Cache:** Redis + ioredis
- **Autenticacao:** JWT (RS256) com Passport.js
- **Storage:** AWS S3 / Cloudflare R2
- **Validacao:** Zod
- **Testes:** Vitest + Supertest

## Arquitetura

```
src/
├── core/                # Entidades base, Either monad, eventos de dominio
├── domain/
│   ├── forum/           # Dominio do forum (questions, answers, comments, attachments)
│   │   ├── application/ # Repositorios (interfaces) e use cases
│   │   └── enterprise/  # Entidades, value objects e eventos
│   └── notification/    # Dominio de notificacoes
│       ├── application/ # Subscribers e use cases
│       └── enterprise/  # Entidade Notification
└── infra/               # Camada de infraestrutura
    ├── auth/            # JWT strategy e guards
    ├── cache/           # Redis cache repository
    ├── database/        # Prisma client e repositorios
    ├── http/            # Controllers, pipes e presenters
    ├── storage/         # R2 storage (S3)
    └── events/          # Event handling (NestJS)
```

## Pre-requisitos

- Node.js
- Docker e Docker Compose

## Setup

```bash
# Instalar dependencias
npm install

# Subir PostgreSQL e Redis
docker-compose up -d

# Rodar migrations
npx prisma migrate dev

# Copiar variaveis de ambiente
cp .env.example .env
```

## Variaveis de ambiente

| Variavel | Descricao | Default |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | - |
| `JWT_PRIVATE_KEY` | Chave privada RS256 (base64) | - |
| `JWT_PUBLIC_KEY` | Chave publica RS256 (base64) | - |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID do Cloudflare R2 | - |
| `AWS_BUCKET_NAME` | Nome do bucket S3/R2 | - |
| `AWS_ACCESS_KEY_ID` | Access key AWS/R2 | - |
| `AWS_SECRET_ACCESS_KEY` | Secret key AWS/R2 | - |
| `REDIS_HOST` | Host do Redis | `127.0.0.1` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `REDIS_DB` | Database do Redis | `0` |
| `PORT` | Porta da aplicacao | `3333` |

## Rodando a aplicacao

```bash
# Desenvolvimento (watch mode)
npm run start:dev

# Producao
npm run build
npm run start:prod
```

## Testes

```bash
# Testes unitarios
npm run test

# Testes unitarios (watch)
npm run test:watch

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## Endpoints

### Autenticacao

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/accounts` | Criar conta |
| `POST` | `/session` | Autenticar e obter JWT |

### Questions (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/questions` | Criar pergunta |
| `GET` | `/questions?page=1` | Listar perguntas recentes |
| `GET` | `/questions/:slug` | Buscar pergunta por slug |
| `PUT` | `/questions/:id` | Editar pergunta |
| `DELETE` | `/questions/:id` | Deletar pergunta |

### Answers (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/questions/:questionId/answers` | Responder pergunta |
| `PUT` | `/answers/:id` | Editar resposta |
| `DELETE` | `/answers/:id` | Deletar resposta |
| `PATCH` | `/answers/:answerId/choose-as-best` | Escolher melhor resposta |

### Comments (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/questions/:questionId/comments` | Comentar em pergunta |
| `POST` | `/answers/:answerId/comments` | Comentar em resposta |
| `DELETE` | `/questions/:questionId/comments/:commentId` | Deletar comentario de pergunta |
| `DELETE` | `/answers/:answerId/comments/:commentId` | Deletar comentario de resposta |
| `GET` | `/questions/:questionId/comments` | Listar comentarios de pergunta |
| `GET` | `/answers/:answerId/comments` | Listar comentarios de resposta |

### Answers de uma Question (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/questions/:questionId/answers` | Listar respostas de uma pergunta |

### Attachments (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/attachments` | Upload de arquivo (PNG, JPG, JPEG, PDF - max 2MB) |

### Notifications (requer JWT)

| Metodo | Rota | Descricao |
|---|---|---|
| `PATCH` | `/notifications/:notificationId/read` | Marcar notificacao como lida |

## Use Cases

**Forum:**
- Criar, editar e deletar perguntas
- Responder perguntas e escolher melhor resposta
- Comentar em perguntas e respostas
- Listar perguntas recentes com paginacao
- Buscar pergunta por slug
- Upload de anexos

**Notificacoes:**
- Notificacao automatica ao criar resposta
- Notificacao ao escolher melhor resposta
- Marcar notificacao como lida

## Padroes utilizados

- **Clean Architecture** - Separacao entre dominio, aplicacao e infraestrutura
- **DDD** - Entidades ricas, Aggregate Roots, Value Objects (Slug)
- **Either Monad** - Tratamento funcional de erros
- **Repository Pattern** - Abstracao de acesso a dados
- **Domain Events** - Eventos de dominio com subscribers
- **Dependency Injection** - IoC container do NestJS
