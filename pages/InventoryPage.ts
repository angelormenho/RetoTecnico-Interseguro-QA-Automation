import { type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../utils/price';

/** Valores del selector de orden de SauceDemo. */
export const SortOption = {
  NameAsc: 'az',
  NameDesc: 'za',
  PriceLowToHigh: 'lohi',
  PriceHighToLow: 'hilo',
} as const;
export type SortOption = (typeof SortOption)[keyof typeof SortOption];

/** Listado de productos (ruta "/inventory.html"). */
export class InventoryPage {
  readonly title: Locator;
  readonly inventoryList: Locator;
  readonly items: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly activeSortOption: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.inventoryList = page.getByTestId('inventory-list');
    this.items = page.getByTestId('inventory-item');
    this.itemPrices = this.items.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.activeSortOption = page.getByTestId('active-option');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }
  
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /** Tarjeta de un producto, localizada por su nombre visible. */
  item(productName: string): Locator {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
  }

  async addToCart(productName: string): Promise<void> {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** Precio mostrado en el listado para un producto (en dólares). */
  async priceOf(productName: string): Promise<number> {
    const text = await this.item(productName).getByTestId('inventory-item-price').innerText();
    return parsePrice(text);
  }

  /** Precios de todos los productos, en el orden en que se muestran. */
  async allPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parsePrice);
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}