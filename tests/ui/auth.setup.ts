import { test as setup, expect } from '../../fixtures/ui.fixture';
import { config } from '../../config/env';

/**
 * Inicia sesión una sola vez con standard_user y guarda la sesión (cookie
 * "session-username") para que los tests de UI que no prueban el login
 * arranquen directamente autenticados.
 */
setup('autenticar standard_user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(config.ui.users.standard, config.ui.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.inventoryList).toBeVisible();

  await page.context().storageState({ path: config.ui.authStatePath });
})