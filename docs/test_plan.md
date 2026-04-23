# Plano de Testes - BarberSync API

## 1. Introdução
Este documento descreve a estratégia de teste para a BarberSync API. O objetivo é garantir que as funcionalidades de agendamento, gestão de barbeiros e autenticação funcionem conforme os requisitos.

## 2. Escopo dos Testes

### 2.1 Em Escopo
- Autenticação e Autorização (JWT).
- Fluxo de Agendamento (CRUD e Regras de Negócio).
- Gestão de Usuários (Admin e Cliente).
- Validação de dados de entrada.
- Testes de concorrência (dois agendamentos no mesmo horário).
- Testes de Performance (Carga e Estresse).

### 2.2 Fora de Escopo
- Testes de interface (Frontend).
- Testes de usabilidade mobile.

## 3. Ferramentas e Tecnologias
- **Automação de API:** Mocha, Chai, Supertest.
- **Teste de Performance:** k6.
- **Gestão de Defeitos:** GitHub Issues.
- **Documentação de API:** Swagger/OpenAPI.
- **Banco de Dados de Teste:** SQLite (In-memory ou arquivo separado).

## 4. Estratégia de Teste

### 4.1 Níveis de Teste
1. **Teste de API (Contrato e Funcional):** Validar se os endpoints retornam os status codes e payloads corretos.
2. **Teste de Integração:** Validar a persistência no banco de dados.
3. **Teste de Performance:** Validar o comportamento sob carga.

### 4.2 Critérios de Aceitação
- 100% dos casos de teste críticos aprovados.
- Nenhum bug de gravidade "Crítica" ou "Alta" aberto.

## 5. Ambiente de Teste
- **Local:** Node.js v18+.
- **Base de Dados:** SQLite (limpo a cada execução de teste).

## 6. Report de Defeitos
Os defeitos serão reportados seguindo o padrão:
- **Título:** [Feature] Descrição curta do erro
- **Severidade:** Baixa, Média, Alta, Crítica
- **Passos para reproduzir:** ...
- **Resultado esperado vs Resultado atual.**
