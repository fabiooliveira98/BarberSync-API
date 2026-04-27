import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

/**
 * Realiza o login de um usuário e retorna o token JWT
 * @param {Object} user - Objeto com email e senha
 */
export function login(user) {
  const payload = JSON.stringify({
    email: user.email,
    senha: user.senha,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/autenticacao/login`, payload, params);
  
  if (res.status === 200) {
    return res.json().token;
  }
  
  return null;
}

/**
 * Garante que o usuário de teste existe no banco (Registro preventivo)
 */
export function ensureUserExists(user) {
  const payload = JSON.stringify(user);
  const params = { headers: { 'Content-Type': 'application/json' } };
  
  // Tenta registrar (se já existir, a API retornará 400, o que ignoramos)
  http.post(`${BASE_URL}/autenticacao/registrar`, payload, params);
}
