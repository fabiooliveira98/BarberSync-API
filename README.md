# BarberSync API 💈

API profissional para gestão de barbearias que centraliza agendamentos, controle de profissionais e consultas de disponibilidade em tempo real. Desenvolvida com **Node.js** e **SQLite**, a solução foca em segurança através de autenticação **JWT** e integridade de dados com uma suíte completa de **testes automatizados**.

## 🚀 Tecnologias Utilizadas
- **Node.js & Express**: Core da aplicação.
- **SQLite**: Banco de dados relacional leve e eficiente.
- **JWT & Bcrypt**: Autenticação segura e criptografia de senhas.
- **Mocha, Chai & Supertest**: Frameworks de testes automatizados e asserções.
- **k6**: Testes de performance, stress e resiliência (Spike).
- **Mochawesome**: Relatórios visuais de execução de testes.
- **Swagger (OpenAPI)**: Documentação interativa de endpoints.

## 📦 Como Instalar e Rodar

### 1. Pré-requisitos
- **Node.js** (v18 ou superior)
- **NPM** (instalado junto com o Node)

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
# Instalar dependências
npm install
```

### 3. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto e configure as seguintes chaves (exemplo):
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
ADMIN_REGISTRATION_KEY=batman123
```

### 4. Executando o Servidor
```bash
# Modo de produção
npm start

# Modo de desenvolvimento (com nodemon)
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

## 🧪 Estratégia de Testes e QA
Este projeto utiliza uma abordagem rigorosa de qualidade:
- **Isolamento de Banco**: Testes rodam em um banco `database_test.sqlite` dedicado.
- **Comandos Granulares**: Possibilidade de rodar testes por módulos (Auth, Barbeiros, etc).
- **Relatório de Bugs**: Documentação formal de inconsistências identificadas (`docs/BUG_REPORT.md`).

## ⚙️ Como Executar os Testes
Para rodar toda a suíte de automação:
```bash
npm test
```

Para rodar módulos específicos:
```bash
npm run test:auth
npm run test:barbeiros
npm run test:agendamentos
npm run test:disponibilidade
npm run test:admin
```
## ⚙️ Como Executar os Testes de performance com k6
```bash
npm run test:perf:smoke  # Validação inicial
npm run test:perf:load   # Carga (50 usuários)
npm run test:perf:stress # Stress (300 usuários)
npm run test:perf:spike  # Surto repentino
```

## 📄 Documentação
- A documentação interativa pode ser acessada via Swagger (ao rodar o servidor).
- Detalhes de User Stories e Casos de Teste estão na **Wiki** interna do projeto.
