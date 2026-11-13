import { test, expect } from '../../fixtures/api.fixture';
import type { CreatedResponse, MessageResponse, User } from '../../api/types';
import { buildUser } from '../../test-data/api.factory';
import { API_MESSAGES } from '../../test-data/api.messages';

test.describe('Usuarios', () => {
  test('API-01 crear usuario administrador con datos válidos', async ({ api, cleaner }) => {
    const newUser = buildUser({ administrador: 'true' });

    const response = await api.createUser(newUser);

    expect(response.status()).toBe(201);
    const body = (await response.json()) as CreatedResponse;
    expect(body).toEqual({
      message: API_MESSAGES.createdSuccessfully,
      _id: expect.stringMatching(/^\w+$/),
    });
    cleaner.trackUser(body._id);

    // El usuario realmente quedó persistido con los datos enviados.
    const getResponse = await api.getUser(body._id);
    expect(getResponse.status()).toBe(200);
    expect((await getResponse.json()) as User).toEqual({ ...newUser, _id: body._id });
  });

  test('API-05 rechaza crear un usuario con un email ya registrado', async ({ api, adminUser }) => {
    const duplicated = buildUser({ email: adminUser.email });

    const response = await api.createUser(duplicated);

    expect(response.status()).toBe(400);
    const body = (await response.json()) as MessageResponse;
    expect(body).toEqual({ message: API_MESSAGES.emailAlreadyUsed });
  });
});