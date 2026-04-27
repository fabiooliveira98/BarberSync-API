import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp-up: sobe para 50 usuários
    { duration: '3m', target: 50 }, // Estabilidade: mantém 50 usuários
    { duration: '1m', target: 0 },  // Ramp-down: desce para 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser < 500ms
    http_req_failed: ['rate<0.01'],   // Menos de 1% de erro
  },
};

export default function () {
  // Testando dois endpoints simultaneamente
  const responses = http.batch([
    ['GET', 'http://localhost:3000/barbeiros'],
    ['GET', 'http://localhost:3000/barbeiros/1/disponibilidade?data=2026-12-10'],
  ]);

  check(responses[0], {
    'status barbeiros é 200': (r) => r.status === 200,
  });

  check(responses[1], {
    'status disponibilidade é 200': (r) => r.status === 200,
  });

  sleep(1);
}
