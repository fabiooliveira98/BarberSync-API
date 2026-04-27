# 📊 Relatório de Performance - BarberSync API

Este documento detalha os resultados dos testes de carga e stress realizados na API utilizando o **Grafana k6**. O objetivo foi validar a escalabilidade, resiliência e estabilidade do sistema sob diferentes volumes de tráfego.

## 🚀 Metodologia
Utilizamos o **k6** para simular quatro cenários distintos de tráfego, monitorando latência (HTTP Req Duration), Throughput (Requests per Second) e taxas de erro.

---

## 📈 Resumo dos Resultados

| Cenário | VUs (Usuários) | Requisições Totais | Req/s (Pico) | Latência P(95) | Taxa de Sucesso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Smoke Test** | 1 | 60 | 1.0/s | 3.35 ms | 100% |
| **Load Test** | 50 | 24.034 | 80.0/s | 4.71 ms | 100% |
| **Stress Test** | 300 | 161.732 | 207.1/s | 4.03 ms | 100% |
| **Spike Test** | 300 (Instantâneo) | 12.130 | 240.0/s | 3.11 ms | 100% |

---

## 🔍 Análise Detalhada

### 1. Estabilidade de Latência
Mesmo com o aumento de **1 para 300 usuários simultâneos**, a latência no percentil 95 (P95) manteve-se abaixo de **5ms**. Isso indica que a arquitetura baseada em Node.js e o banco de dados SQLite (para operações de leitura) são extremamente eficientes e não apresentam gargalos de processamento sob carga moderada/alta.

### 2. Resiliência a Surtos (Spike)
No teste de surto (**Spike Test**), o sistema recebeu 300 conexões em apenas 10 segundos. A API manteve 0% de erro e a latência máxima registrada foi de apenas **9.29ms**, demonstrando uma excelente capacidade de lidar com picos repentinos de tráfego sem degradação de performance.

### 3. Capacidade de Processamento (Throughput)
O sistema atingiu um pico de **240 requisições por segundo**. Para uma aplicação rodando em ambiente local, este número demonstra que a API está pronta para suportar milhares de acessos diários em um ambiente de produção real.

---

## 🏆 Conclusão
A **BarberSync API** foi aprovada em todos os critérios de performance:
- **Escalabilidade:** Performance linear sem degradação significativa até 300 usuários.
- **Confiabilidade:** 0% de falhas em todos os cenários de stress.
- **Eficiência:** Tempos de resposta em milissegundos mesmo sob carga pesada.

---
*Relatório gerado automaticamente via k6 Automation Suite em 26/04/2026.*
