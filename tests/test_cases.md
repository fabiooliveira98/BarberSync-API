# Casos de Teste - BarberSync API

## CT01 - Autenticação e Login

| ID | Descrição | Pré-condição | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| CT01.1 | Login com sucesso | Usuário cadastrado | Enviar POST /autenticacao/login com e-mail e senha válidos | Retornar 200 OK e um Token JWT válido |
| CT01.2 | Login com senha inválida | Usuário cadastrado | Enviar POST /autenticacao/login com senha incorreta | Retornar 401 Unauthorized |
| CT01.3 | Acesso a rota protegida sem token | Rota /barbeiros cadastrada | Enviar GET /barbeiros sem header Authorization | Retornar 401 Unauthorized |

## CT02 - Agendamentos (Business Rules)

| ID | Descrição | Pré-condição | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| CT02.1 | Agendamento com sucesso | Barbeiro disponível | Enviar POST /agendamentos com data/hora livre | Retornar 201 Created e dados do agendamento |
| CT02.2 | Agendamento em horário duplicado | Já existe agendamento | Enviar POST /agendamentos para o mesmo barbeiro e horário | Retornar 400 Bad Request: "O barbeiro já possui um agendamento neste horário" |
| CT02.3 | Agendamento em data retroativa | N/A | Enviar POST /agendamentos com data no passado | Retornar 400 Bad Request |
