import { test, expect } from '../../fixtures/api.fixture';
import type { LoginResponse } from '../../api/types';
import { API_MESSAGES } from '../../test-data/api.messages';

test.describe('Login', () => {
  test('API-02 iniciar sesión con el usuario creado devuelve un token', async ({ api, adminUser }) => {
    const response = await api.login({ email: adminUser.email, password: adminUser.password });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as LoginResponse;
    expect(body.message).toBe(API_MESSAGES.loginSuccessful);
    // Formato "Bearer <JWT>": header.payload.firma
    expect(body.authorization).toMatch(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
  });
});