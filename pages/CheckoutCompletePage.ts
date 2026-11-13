import { type Locator, type Page } from '@playwright/test';

/** Confirmación de compra (ruta "/checkout-complete.html"). */
export class CheckoutCompletePage {
  readonly header: Locator;
  readonly text: Locator;

  constructor(page: Page) {
    this.header = page.getByTestId('complete-header');
    this.text = page.getByTestId('complete-text');
  }
}