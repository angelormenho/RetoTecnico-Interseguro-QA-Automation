import { test, expect } from '../../fixtures/ui.fixture';
import { config } from '../../config/env';
import { UI_MESSAGES } from '../../test-data/ui.data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Inicio de sesión', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('UI-01 Iniciar sesión con standard_user y validar que el usuario accede al listadode productos.', 
    
    async ({page,loginPage,inventoryPage}) => {

    await loginPage.login(config.ui.users.standard, config.ui.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText(UI_MESSAGES.inventoryTitle);
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.items.first()).toBeVisible();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('UI-02 Iniciar sesión con locked_out_user y validar que se muestra el mensaje de error correspondiente y que el usuario no accede al listado de productos', 
    
    async ({page,loginPage,inventoryPage}) => {

    await loginPage.login(config.ui.users.lockedOut, config.ui.password);

    await expect(loginPage.errorMessage).toHaveText(UI_MESSAGES.lockedOutError);
    await expect(page).not.toHaveURL(/\/inventory\.html/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.inventoryList).toBeHidden();
  });
});