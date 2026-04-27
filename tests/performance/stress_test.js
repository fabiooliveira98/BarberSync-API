import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Sobe para 100
    { duration: '2m', target: 200 }, // Sobe para 200
    { duration: '2m', target: 300 }, // Sobe para 300
    { duration: '5m', target: 300 }, // Mantém o stress em 300
    { duration: '2m', target: 0 },   // Descanso
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Aceitamos até 1 segundo de latência sob stress
    http_req_failed: ['rate<0.05'],    // Aceitamos até 5% de erro no limite extremo
  },
};

export default function () {
  const url = 'http://localhost:3000/barbeiros/1/disponibilidade?data=2026-12-10';
  const res = http.get(url);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}
