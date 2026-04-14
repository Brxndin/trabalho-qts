# O que é

Servidor e Aplicativo para listagem e manipulação de serviços e funcionários de uma clínica de cardiologia.

# Objetivo

Desenvolvido para a cadeira de Qualidade e Teste de Software.

# Tecnologias usadas

- JavaScript
- Express.js
- React
- Docker
- Knex.js
- MariaDB
- Mailpit

# Como usar

## /server

Para usar o servidor, são necessários alguns passos para instalar as dependências e configurar o que é necessário.

- Entre na pasta usando `cd server`.
- Copie o arquivo `.env.example` e crie o arquivo `.env`. Nele ficam as variáveis de ambiente usadas no projeto, que devem ser modificadas para poder usar o sistema. Recomendo que, para ambiente de desenvolvimento, os hosts sejam todos `localhost` e que as portas sigam esse padrão: PORT: 8080, DB_PORT: 3306, MAIL_PORT: 1025, FRONT_PORT: 5173 (padrão do React).
- Instale as dependências do node usando o comando `npm i` e os softwares auxiliares por meio do Docker, rodando o comando `docker compose up -d`. O Docker instalará o MariaDB e o Mailpit (servidor de e-mail local usado para enviar e-mails no ambiente de desenvolvimento).
- Rode as migrations para criar o banco de dados usando o comando `npx knex migrate:latest`.
- Rode as seeder para adicionar o usuário inicial usando o comando `npx knex seed:run`.
- Inicie o servidor usando o comando `npm start` ou `npm run dev` (para ambiente de desenvolvimento).
- Para acessar o servidor de e-mail (Mailpit), acesse o endereço localhost:8025. Ele serve para simular o envio de e-mails de troca e definição de senhas.

Após isso, se tudo deu certo, será mostrado o link de acesso ao servidor, que será definido conforme as configurações que você colocou no arquivo `.env`.

## /app

Para usar o app, são necessários alguns passos para instalar as dependências e configurar o que é necessário.

- Entre na pasta usando `cd app`.
- Instale as dependências do node usando o comando `npm i`.
- Inicie o servidor usando o comando `npm start` ou `npm run dev` (para ambiente de desenvolvimento). 

Após isso, se tudo deu certo, será mostrado o link de acesso ao servidor, que roda no port 5173, padrão do React.

# Acesso

O usuário inicial tem o e-mail `admin@ifrs.edu.br` e a senha `Senha.123`.