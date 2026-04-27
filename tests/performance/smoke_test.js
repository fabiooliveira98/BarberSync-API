import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1, // 1 Usuário Virtual
  duration: '1m', // Duração de 1 minuto
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% das requisições devem ser abaixo de 200ms
  },
};

export default function () {
  // Testando o endpoint de listagem de barbeiros
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const res = http.get(`${BASE_URL}/barbeiros`);
  
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // Espera 1 segundo entre as requisições
}
