import * as dotenv from 'dotenv';
import * as path from 'path';

// Carga variables desde .env (si existe). Las variables ya definidas en el
// entorno (por ejemplo en CI) tienen prioridad.
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

/** Devuelve la variable de entorno o un valor por defecto documentado en .env.example. */
function env(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : fallback;
}

/**
 * Único punto de configuración de la suite. Los tests nunca contienen URLs ni
 * credenciales: siempre las leen desde aquí.
 */
export const config = {
  ui: {
    baseURL: env('UI_BASE_URL', 'https://www.saucedemo.com'),
    users: {
      standard: env('UI_STANDARD_USER', 'standard_user'),
      lockedOut: env('UI_LOCKED_USER', 'locked_out_user'),
    },
    password: env('UI_PASSWORD', 'secret_sauce'),
    /** Sesión de standard_user generada por tests/ui/auth.setup.ts. */
    authStatePath: path.resolve(__dirname, '..', 'playwright', '.auth', 'standard-user.json'),
  },
  api: {
    baseURL: env('API_BASE_URL', 'https://serverest.dev'),
  },
} as const;