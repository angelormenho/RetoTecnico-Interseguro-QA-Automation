import { type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../utils/price';

/** Checkout paso 2: resumen de la orden (ruta "/checkout-step-two.html"). */
export class CheckoutOverviewPage {
  readonly itemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.itemNames = page.getByTestId('cart-list').getByTestId('inventory-item-name');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.finishButton = page.getByTestId('finish');
  }

  /** Valor numérico de "Item total: $X". */
  async itemTotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}