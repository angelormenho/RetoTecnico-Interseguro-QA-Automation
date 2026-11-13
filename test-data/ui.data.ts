import type { BuyerInfo } from '../pages/CheckoutInformationPage';

/** Productos usados en el escenario de compra (UI-03). */
export const PRODUCTS_TO_BUY = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;

export const BUYER: BuyerInfo = {
  firstName: 'Angel',
  lastName: 'Ormeño',
  postalCode: '15016',
};

export const UI_MESSAGES = {
  inventoryTitle: 'Products',
  lockedOutError: 'Epic sadface: Sorry, this user has been locked out.',
  orderCompleteHeader: 'Thank you for your order!',
  priceLowToHigh: 'Price (low to high)',
} as const;