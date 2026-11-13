import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env';

/** Sesión de standard_user generada por tests/ui/auth.setup.ts y reutilizada por los tests de UI. */
const STANDARD_USER_STATE = config.ui.authStatePath;

export default defineConfig({
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    // SauceDemo expone atributos data-test estables: los usamos con getByTestId().
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ---------- UI ----------
    {
      name: 'setup',
      testDir: './tests/ui',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: config.ui.baseURL },
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.ui.baseURL,
        storageState: STANDARD_USER_STATE,
      },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        baseURL: config.ui.baseURL,
        storageState: STANDARD_USER_STATE,
      },
    },

    // ---------- API ----------
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: config.api.baseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});