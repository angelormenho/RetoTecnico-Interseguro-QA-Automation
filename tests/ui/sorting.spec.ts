import { test, expect } from '../../fixtures/ui.fixture';
import { SortOption } from '../../pages/InventoryPage';
import { UI_MESSAGES } from '../../test-data/ui.data';

test.describe('Ordenamiento del listado', () => {
  test('UI-04 Ordenar los productos por precio de menor a mayor y validar que el listado completo queda ordenado correctamente.', 
    
    async ({ inventoryPage }) => {
    
    await inventoryPage.goto();
    await expect(inventoryPage.items.first()).toBeVisible();

    // Orden esperado calculado a partir de los precios reales del listado.
    const pricesBefore = await inventoryPage.allPrices();
    const expectedOrder = [...pricesBefore].sort((a, b) => a - b);

    await inventoryPage.sortBy(SortOption.PriceLowToHigh);

    await expect(inventoryPage.activeSortOption).toHaveText(UI_MESSAGES.priceLowToHigh);
    // toHaveText con un arreglo valida la lista COMPLETA (cantidad y orden) y
    // reintenta hasta que el DOM se re-renderice, sin esperas fijas.
    await expect(inventoryPage.itemPrices).toHaveText(expectedOrder.map((p) => `$${p.toFixed(2)}`));
  });
});