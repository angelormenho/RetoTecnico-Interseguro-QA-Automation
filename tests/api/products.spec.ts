import { test, expect } from '../../fixtures/api.fixture';
import type { CreatedResponse, MessageResponse, Product, ProductListResponse } from '../../api/types';
import { buildProduct } from '../../test-data/api.factory';
import { API_MESSAGES } from '../../test-data/api.messages';

test.describe('Productos', () => {
  test('API-03 crear un producto y consultarlo por su id', async ({ api, adminToken, cleaner }) => {
    const newProduct = buildProduct();

    const createResponse = await api.createProduct(newProduct, adminToken);

    expect(createResponse.status()).toBe(201);
    const created = (await createResponse.json()) as CreatedResponse;
    expect(created.message).toBe(API_MESSAGES.createdSuccessfully);
    expect(created._id).toEqual(expect.any(String));
    cleaner.trackProduct(created._id, adminToken);

    const getResponse = await api.getProduct(created._id);

    expect(getResponse.status()).toBe(200);
    expect((await getResponse.json()) as Product).toEqual({ ...newProduct, _id: created._id });
  });

  test('API-04 rechaza crear un producto sin header de autorización', async ({ api }) => {
    const newProduct = buildProduct();

    const response = await api.createProduct(newProduct);

    expect(response.status()).toBe(401);
    expect((await response.json()) as MessageResponse).toEqual({ message: API_MESSAGES.missingToken });

    // Y el producto no se creó.
    const search = await api.findProducts({ nome: newProduct.nome });
    expect(search.status()).toBe(200);
    expect(((await search.json()) as ProductListResponse).quantidade).toBe(0);
  });
});