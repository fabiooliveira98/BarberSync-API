import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 300 }, // Sobe instantaneamente para 300
    { duration: '30s', target: 300 }, // Mantém o surto
    { duration: '10s', target: 0 },   // Desce instantaneamente
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // No surto, aceitamos no máximo 1% de erro
  },
};

export default function () {
  const url = 'http://localhost:3000/barbeiros';
  const res = http.get(url);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}
