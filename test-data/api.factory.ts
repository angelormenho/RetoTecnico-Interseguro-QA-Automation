import { randomUUID } from 'crypto';
import type { ProductPayload, UserPayload } from '../api/types';

/**
 * ServeRest es una instancia pública compartida: email de usuario y nombre de
 * producto deben ser únicos. Combinamos timestamp + UUID corto para que no
 * choquen ni entre ejecuciones ni entre workers en paralelo.
 */
export function uniqueId(): string {
  return `${Date.now()}${randomUUID().slice(0, 8)}`;
}

export function buildUser(overrides: Partial<UserPayload> = {}): UserPayload {
  const id = uniqueId();
  return {
    nome: `QA Automation ${id}`,
    // ServeRest valida el TLD: dominios reservados como ".test" se rechazan.
    email: `qa.${id}@automation.com`,
    password: `Pw-${randomUUID().slice(0, 12)}`,
    administrador: 'true',
    ...overrides,
  };
}

export function buildProduct(overrides: Partial<ProductPayload> = {}): ProductPayload {
  const id = uniqueId();
  return {
    nome: `Producto QA ${id}`,
    preco: 100 + Math.floor(Math.random() * 900),
    descricao: `Producto creado por la suite de automatización (${id})`,
    quantidade: 1 + Math.floor(Math.random() * 50),
    ...overrides,
  };
}