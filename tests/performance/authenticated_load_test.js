import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { login, ensureUserExists } from './helpers/auth.js';

// Carregar fixture de usuários (agora como array)
const usersData = new SharedArray('users', function () {
  return JSON.parse(open('./fixtures/users.json'));
});
const testUser = usersData[0];

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up
    { duration: '1m', target: 20 },  // Estabilidade
    { duration: '30s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

// Configuração inicial: garantir que o usuário existe no banco
export function setup() {
  ensureUserExists(testUser);
}

export default function () {
  // 1. Realizar Login para obter o token (Simula o custo de processamento do Bcrypt)
  const token = login(testUser);
  
  check(token, {
    'login realizado com sucesso': (t) => t !== null,
  });

  if (token) {
    const params = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // 2. Acessar rota protegida
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
    const res = http.get(`${BASE_URL}/agendamentos`, params);

    check(res, {
      'status agendamentos é 200': (r) => r.status === 200,
      'token foi validado': (r) => r.json() !== undefined,
    });
  }

  sleep(1);
}

// Gerar Relatório HTML com Gráficos ao final
export function handleSummary(data) {
  return {
    "docs/relatorios/performance_autenticada.html": htmlReport(data),
  };
}
