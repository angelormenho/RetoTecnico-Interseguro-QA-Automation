import { test, expect } from '../../fixtures/ui.fixture';
import { BUYER, PRODUCTS_TO_BUY, UI_MESSAGES } from '../../test-data/ui.data';
import { sumPrices } from '../../utils/price';

test.describe('Compra', () => {
  test('UI-03 compra completa de dos productos', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    
    await inventoryPage.goto();

    const prices: number[] = [];
    for (const product of PRODUCTS_TO_BUY) {
      prices.push(await inventoryPage.priceOf(product));
      await inventoryPage.addToCart(product);
    }
    await expect(inventoryPage.cartBadge).toHaveText(String(PRODUCTS_TO_BUY.length));

    await test.step('el carrito contiene exactamente los productos elegidos', async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.itemNames).toHaveText([...PRODUCTS_TO_BUY]);
    });

    await test.step('datos del comprador', async () => {
      await cartPage.checkout();
      await checkoutInformationPage.fillAndContinue(BUYER);
      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    });

    await test.step('el Item total es la suma de los precios elegidos', async () => {
      await expect(checkoutOverviewPage.itemNames).toHaveText([...PRODUCTS_TO_BUY]);
      expect(await checkoutOverviewPage.itemTotal()).toBe(sumPrices(prices));
    });

    await test.step('finalizar y validar la confirmación', async () => {
      await checkoutOverviewPage.finish();
      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutCompletePage.header).toHaveText(UI_MESSAGES.orderCompleteHeader);
      await expect(inventoryPage.cartBadge).toBeHidden();
    });
  });
});