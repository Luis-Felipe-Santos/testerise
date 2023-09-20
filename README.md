# Testerise Backend


## Pré-requisitos

- Node.js e npm instalados em sua máquina.
- Banco de dados MySQL

## Instalação

Clone o repositório:

git clone https://github.com/Luis-Felipe-Santos/testerise

Navegue até o diretório do projeto:

cd testerise

Instale as dependências:

npm install

Crie um arquivo .env na raiz do projeto e configure suas variáveis de ambiente (por exemplo, detalhes de conexão de banco de dados, segredos de API).

## Uso

Para iniciar o servidor de desenvolvimento, execute:
npm start

O servidor será executado em http://localhost:YOUR_PORT por padrão.

## Scripts

npm run build: Transpile arquivos TypeScript para JavaScript.

npm start: inicie o servidor de desenvolvimento usando ts-node-dev.

npm run typeorm: executa comandos TypeORM CLI.


## Dependências

cors: middleware CORS para Express.

dotenv: carrega variáveis de ambiente de um arquivo .env.

express: estrutura da web rápida, sem opinião e minimalista para Node.js.

jsonwebtoken: biblioteca JSON Web Token (JWT).

mysql2: cliente MySQL para Node.js.

reflect-metadata: Polyfill para reflect-metadata exigido pelo TypeORM.

typeorm: biblioteca de mapeamento objeto-relacional (ORM).

## Dependências de desenvolvimento

@types/cors: definições de tipo TypeScript para cors.

@types/express: definições de tipo TypeScript para express.

@types/jsonwebtoken: definições de tipo TypeScript para jsonwebtoken.

@types/node: definições de tipo TypeScript para Node.js.

ts-node: execução TypeScript e REPL para Node.js.

ts-node-dev: ferramenta de execução e desenvolvimento TypeScript.