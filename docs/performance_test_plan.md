# Plano de Ação: Testes de Performance com k6

Este plano detalha como iremos validar a capacidade da **BarberSync API** de suportar múltiplos usuários simultâneos e identificar gargalos de performance.

## 1. Objetivos dos Testes
- **Latência:** Medir o tempo de resposta médio dos principais endpoints.
- **Throughput:** Identificar quantas requisições por segundo a API suporta.
- **Estabilidade:** Verificar se há vazamento de memória ou erros de concorrência no SQLite sob carga.
- **Pontos de Ruptura (Breakpoint):** Descobrir com quantos usuários a API começa a falhar (Erro 500 ou Timeout).

## 2. Cenários Propostos
Proponho executarmos quatro tipos de testes progressivos:

| Tipo de Teste | Carga (Usuários) | Duração | Objetivo |
| :--- | :--- | :--- | :--- |
| **Smoke Test** | 1 VU (Virtual User) | 1 min | Validar se o script de teste está correto e a API responde. |
| **Load Test** | 10 a 50 VUs | 5 min | Simular um dia normal de uso intenso na barbearia. |
| **Stress Test** | 100 a 500 VUs | 10 min | Forçar o sistema para encontrar o limite de conexões do SQLite. |
| **Spike Test** | 0 a 300 VUs (Súbito) | 2 min | Simular um surto de acessos (ex: abertura de agenda de Natal). |

## 3. Endpoints Alvos
Focaremos nos fluxos que mais consomem processamento e banco de dados:
1.  **Listagem de Barbeiros (`GET /barbeiros`)**: Teste de leitura simples.
2.  **Consulta de Disponibilidade (`GET /barbeiros/1/disponibilidade`)**: Teste de lógica e cruzamento de dados.
3.  **Fluxo de Login (`POST /autenticacao/login`)**: Teste de processamento de CPU (Bcrypt).

## 4. Passos da Implementação

### Passo 1: Instalação do k6
- Verificar se o k6 está instalado na máquina ou via `npm`.

### Passo 2: Criação dos Scripts (`tests/performance/`)
- Criar scripts `.js` para o k6.
- Definir **Thresholds** (Limites): Ex: 95% das requisições devem responder em menos de 200ms.

### Passo 3: Preparação do Banco de Dados
- Popular o banco com dados suficientes para os testes serem realistas.

### Passo 4: Execução e Análise
- Rodar os testes e analisar os resultados no terminal (e futuramente em dashboards).
