import { test as base, expect } from '@playwright/test';
import { ServeRestClient } from '../api/ServeRestClient';
import type { CreatedResponse, LoginResponse, User } from '../api/types';
import { buildUser } from '../test-data/api.factory';

/** Registra lo que crea un test para borrarlo al final, pase o falle. */
export class DataCleaner {
  private readonly userIds: string[] = [];
  private readonly products: { id: string; token: string }[] = [];

  trackUser(id: string): void {
    this.userIds.push(id);
  }

  trackProduct(id: string, token: string): void {
    this.products.push({ id, token });
  }

  async cleanUp(api: ServeRestClient): Promise<void> {
    // Primero productos (requieren el token del admin), luego usuarios.
    for (const { id, token } of this.products) {
      await this.warnIfFailed(`producto ${id}`, api.deleteProduct(id, token));
    }
    for (const id of this.userIds) {
      await this.warnIfFailed(`usuario ${id}`, api.deleteUser(id));
    }
  }

  // Una limpieza fallida no debe ocultar el resultado real del test.
  private async warnIfFailed(what: string, call: ReturnType<ServeRestClient['deleteUser']>) {
    const response = await call;
    if (!response.ok()) {
      console.warn(`[cleanup] No se pudo eliminar ${what}: ${response.status()} ${await response.text()}`);
    }
  }
}

type ApiFixtures = {
  api: ServeRestClient;
  cleaner: DataCleaner;
  /** Usuario administrador recién creado (único para este test). */
  adminUser: User;
  /** Token "Bearer ..." del adminUser. */
  adminToken: string;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(new ServeRestClient(request));
  },

  cleaner: async ({ api }, use) => {
    const cleaner = new DataCleaner();
    await use(cleaner);
    await cleaner.cleanUp(api);
  },

  adminUser: async ({ api, cleaner }, use) => {
    const payload = buildUser({ administrador: 'true' });
    const response = await api.createUser(payload);
    expect(response.status(), 'precondición: crear usuario admin').toBe(201);
    const { _id } = (await response.json()) as CreatedResponse;
    cleaner.trackUser(_id);
    await use({ ...payload, _id });
  },

  adminToken: async ({ api, adminUser }, use) => {
    const response = await api.login({ email: adminUser.email, password: adminUser.password });
    expect(response.status(), 'precondición: login del admin').toBe(200);
    const { authorization } = (await response.json()) as LoginResponse;
    await use(authorization);
  },
});

export { expect };