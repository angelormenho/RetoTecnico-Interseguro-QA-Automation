import { type Locator, type Page } from '@playwright/test';

/** Carrito de compras (ruta "/cart.html"). */
export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId('cart-list').getByTestId('inventory-item');
    this.itemNames = this.items.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}