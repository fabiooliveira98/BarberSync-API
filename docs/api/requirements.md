# Requisitos - BarberSync API

## 1. Visão Geral
Sistema de API para gestão de agendamentos em barbearias, permitindo que clientes marquem horários e barbeiros gerenciem sua agenda.

## 2. Requisitos Funcionais (RF)

### RF01 - Gestão de Clientes
- O sistema deve permitir o cadastro de clientes (Nome, E-mail, Telefone).
- O sistema deve permitir a edição de dados do cliente.

### RF02 - Gestão de Barbeiros
- O sistema deve permitir o cadastro de barbeiros e seus horários de trabalho.
- Cada barbeiro deve ter uma lista de serviços que realiza.

### RF03 - Agendamento
- O cliente deve poder visualizar os horários disponíveis de um barbeiro.
- O sistema deve permitir criar um agendamento vinculando Cliente + Barbeiro + Serviço + Data/Hora.
- **Regra de Negócio:** Não pode haver dois agendamentos no mesmo horário para o mesmo barbeiro.
- **Regra de Negócio:** Agendamentos só podem ser feitos no futuro.

### RF04 - Cancelamento
- O sistema deve permitir o cancelamento de um agendamento.
- **Regra de Negócio:** O cancelamento deve ser registrado com um status de "Cancelado".

## 3. Requisitos Não Funcionais (RNF)

### RNF01 - Performance
- A API deve responder a consultas de disponibilidade em menos de 200ms.
- Deve suportar múltiplos acessos simultâneos (Testado via k6).

### RNF02 - Segurança/Autenticação
- O acesso a rotas sensíveis deve ser protegido por JWT (JSON Web Token).
- **Perfis de Acesso (RBAC):**
    - **Admin:** Pode gerenciar barbeiros, serviços e visualizar todos os agendamentos.
    - **Cliente:** Pode gerenciar seu próprio perfil e seus agendamentos.

### RNF03 - Persistência
- Os dados devem ser persistidos em um banco de dados (SQLite ou MongoDB).
