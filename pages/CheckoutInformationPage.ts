import { type Locator, type Page } from '@playwright/test';

export interface BuyerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Checkout paso 1: datos del comprador (ruta "/checkout-step-one.html"). */
export class CheckoutInformationPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  async fillAndContinue(buyer: BuyerInfo): Promise<void> {
    await this.firstNameInput.fill(buyer.firstName);
    await this.lastNameInput.fill(buyer.lastName);
    await this.postalCodeInput.fill(buyer.postalCode);
    await this.continueButton.click();
  }
}