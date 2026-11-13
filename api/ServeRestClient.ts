import { type APIRequestContext, type APIResponse } from '@playwright/test';
import type { LoginPayload, ProductPayload, UserPayload } from './types';

/**
 * Cliente delgado sobre el request context de Playwright. Solo conoce los
 * endpoints de ServeRest; las validaciones viven en los tests.
 * La URL base se toma del proyecto "api" en playwright.config.ts.
 */
export class ServeRestClient {
  constructor(private readonly request: APIRequestContext) {}

  // ---------- Usuarios ----------
  createUser(user: UserPayload): Promise<APIResponse> {
    return this.request.post('/usuarios', { data: user });
  }

  getUser(id: string): Promise<APIResponse> {
    return this.request.get(`/usuarios/${id}`);
  }

  deleteUser(id: string): Promise<APIResponse> {
    return this.request.delete(`/usuarios/${id}`);
  }

  // ---------- Login ----------
  login(credentials: LoginPayload): Promise<APIResponse> {
    return this.request.post('/login', { data: credentials });
  }

  // ---------- Productos ----------
  /** Si no se pasa token, la petición se envía sin header Authorization. */
  createProduct(product: ProductPayload, token?: string): Promise<APIResponse> {
    return this.request.post('/produtos', {
      data: product,
      headers: token ? { Authorization: token } : undefined,
    });
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.request.get(`/produtos/${id}`);
  }

  findProducts(filters: Partial<ProductPayload>): Promise<APIResponse> {
    return this.request.get('/produtos', { params: filters });
  }

  deleteProduct(id: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/produtos/${id}`, { headers: { Authorization: token } });
  }
}