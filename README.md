# Reto técnico: QA Automation con Playwright

Suite de pruebas automatizadas de **UI** ([SauceDemo](https://www.saucedemo.com)) y **API** ([ServeRest](https://serverest.dev)) construida con **Playwright + TypeScript** y el runner `@playwright/test`.

| Escenario | Descripción | Archivo |
|---|---|---|
| UI-01 | Login exitoso con `standard_user` | `tests/ui/login.spec.ts` |
| UI-02 | Login de `locked_out_user` (mensaje error y sin acceso) | `tests/ui/login.spec.ts` |
| UI-03 | Compra completa de dos productos | `tests/ui/checkout.spec.ts` |
| UI-04 | Ordenar por precio de menor a mayor | `tests/ui/sorting.spec.ts` |
| API-01 | Crear usuario administrador | `tests/api/users.spec.ts` |
| API-02 | Iniciar sesión y obtener token | `tests/api/login.spec.ts` |
| API-03 | Crear y consultar un producto | `tests/api/products.spec.ts` |
| API-04 | Crear producto sin token (rechazo) | `tests/api/products.spec.ts` |
| API-05 | Email duplicado (rechazo) | `tests/api/users.spec.ts` |

Los tests de UI se ejecutan en **Chromium y Firefox**.

---

## Requisitos

- Node.js 18 o superior (probado con Node 20 en CI y Node 24 en local)
- npm
- Git

## Instalación

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>
npm ci
npx playwright install chromium firefox
```

### Configuración de credenciales

URLs y credenciales **no** están escritas en los tests: se leen desde `config/env.ts`, que toma los valores de variables de entorno o de un archivo `.env`. Si no existe `.env`, se usan los valores públicos del enunciado, por lo que la suite funciona sin configurar nada.

Para sobrescribirlos:

```bash
cp .env.example .env
```

| Variable | Valor por defecto |
|---|---|
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `UI_STANDARD_USER` | `standard_user` |
| `UI_LOCKED_USER` | `locked_out_user` |
| `UI_PASSWORD` | `secret_sauce` |
| `API_BASE_URL` | `https://serverest.dev` |

## Ejecución

| Qué | Comando |
|---|---|
| Suite completa (UI + API) | `npx playwright test` (o `npm test`) |
| Solo UI (Chromium + Firefox) | `npm run test:ui` |
| Solo UI en Chromium | `npm run test:ui:chromium` |
| Solo API | `npm run test:api` |
| UI en modo visible (headed) | `npm run test:headed` |
| Un escenario concreto | `npx playwright test -g "UI-03"` |
| Verificación de tipos | `npm run typecheck` |

## Reporte

Cada ejecución genera el reporte HTML de Playwright en `playwright-report/`. Para abrirlo:

```bash
npx playwright show-report
```

Ante un fallo se adjuntan automáticamente trace, captura de pantalla y video (UI) al reporte.

## Estructura del proyecto

```
.
├── .github/workflows/playwright.yml   # CI: ejecuta la suite y publica el reporte como artefacto
├── api/
│   ├── ServeRestClient.ts             # Cliente de la API sobre el request context de Playwright
│   └── types.ts                       # Tipos de payloads y respuestas
├── config/
│   └── env.ts                         # Único punto de configuración (URLs, credenciales)
├── fixtures/
│   ├── ui.fixture.ts                  # Inyecta los Page Objects en los tests
│   └── api.fixture.ts                 # Cliente API, admin/token por test y limpieza de datos
├── pages/                             # Page Object Model de SauceDemo
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInformationPage.ts
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
├── test-data/
│   ├── ui.data.ts                     # Productos, comprador y textos esperados de la UI
│   ├── api.factory.ts                 # Generadores de datos únicos para la API
│   └── api.messages.ts                # Mensajes esperados de ServeRest
├── tests/
│   ├── ui/
│   │   ├── auth.setup.ts              # Login único y guardado de sesión (storageState)
│   │   ├── login.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── sorting.spec.ts
│   └── api/
│       ├── users.spec.ts
│       ├── login.spec.ts
│       └── products.spec.ts
├── utils/price.ts                     # Parseo y suma de precios (en centavos)
├── playwright.config.ts
└── .env.example
```

## Decisiones técnicas

### Proyectos de Playwright
`playwright.config.ts` define cuatro proyectos:
- `setup`: inicia sesión una vez con `standard_user` y guarda la sesión en `playwright/.auth/` (ignorado en git).
- `ui-chromium` y `ui-firefox`: dependen de `setup` y reutilizan esa sesión.
- `api`: sin navegador, solo con el `request` context y la `baseURL` de ServeRest.

Así `npx playwright test` ejecuta todo y `--project` permite filtrar.

### Page Object Model + fixtures
Cada pantalla de SauceDemo tiene su Page Object, que expone **locators** y **acciones**. Las **aserciones viven en los tests**, así cada test se lee como el escenario del enunciado. Los Page Objects se inyectan con fixtures (`fixtures/ui.fixture.ts`), lo que evita repetir `new XPage(page)` en cada spec.

### Locators estables
SauceDemo expone atributos `data-test`. Se configuró `testIdAttribute: 'data-test'` para usar `getByTestId()`. Los productos se localizan por su **nombre visible**, no por índice, y el botón "Add to cart" por su rol.

### Reutilización de sesión
UI-03 y UI-04 arrancan ya autenticados con `storageState`, porque no prueban el login. UI-01 y UI-02 **sí** prueban el login, así que limpian la sesión con `test.use({ storageState: { cookies: [], origins: [] } })`.

### Validaciones con sentido
- **UI-01**: URL `/inventory.html`, título "Products" y listado visible.
- **UI-02**: mensaje de error exacto, la URL sigue en el login y el listado no es visible.
- **UI-03**: los precios se **leen del listado**, no se escriben a mano. El carrito y el resumen contienen exactamente los productos elegidos. El `Item total` se compara con la suma calculada en centavos para evitar errores de coma flotante. Al final se valida la confirmación y que el carrito queda vacío.
- **UI-04**: el orden esperado se calcula a partir de los precios reales. `toHaveText([...])` compara la **lista completa** (cantidad y orden), así que se detecta cualquier producto fuera de lugar. Los precios repetidos ($15.99) se manejan bien.
- **API-01**: además de validar `201` y el body, se consulta el usuario por id para comprobar que se persistió con los datos enviados.
- **API-03**: el `GET` por id debe ser **idéntico** a lo enviado, más el `_id`.
- **API-04**: además del `401` y el mensaje, se verifica que el producto no se creó, buscándolo por nombre.

### Sin esperas fijas
No se usa `waitForTimeout`. Toda sincronización se basa en el auto-waiting de las acciones y en las aserciones web-first (`expect(locator)...`), que reintentan.

### Independencia y datos únicos en la API
ServeRest es una instancia pública compartida. `test-data/api.factory.ts` genera email y nombre de producto únicos (timestamp + UUID), porque ambos deben ser únicos en ServeRest. Cada test crea sus propios datos mediante fixtures (`adminUser`, `adminToken`), así que no depende de otro test y la suite corre en paralelo (`fullyParallel: true`).

### Limpieza de datos
El fixture `cleaner` registra los usuarios y productos creados y los elimina al terminar cada test, **pase o falle**. Si la limpieza falla, solo deja una advertencia en consola para no ocultar el resultado real del test.

### CI
`.github/workflows/playwright.yml` instala dependencias, verifica los tipos, ejecuta la suite completa y publica `playwright-report/` como artefacto. El reporte se publica incluso si hay fallos. En CI hay 1 reintento para absorber inestabilidades de los sitios públicos.

## Uso de herramientas de IA

Se usó **Claude Code (Anthropic)** como asistente para:
- Analizar los requerimientos del reto y revisar los endpoints de ServeRest y los selectores `data-test` de SauceDemo antes de implementar las pruebas.
- Apoyarme en la definición de la estructura inicial del proyecto, incluyendo Page Objects, fixtures y documentación.
- Generar las fórmulas correspondientes para utilzarloa en los test.

Correcciones necesarias durante el desarrollo:
- **Emails rechazados por ServeRest**: corregí el dominio de los correos utilizados en las pruebas, ya que la API rechazaba el dominio reservado .test con una respuesta 400. Se utilizó un dominio .com.
- **TypeScript 7**: ajusté la configuración de moduleResolution de nodenext para solucionar un problema de compilación.
- **Ruta de la sesión**: revisé la ubicación de la configuración de storageState y trasladé su ruta a config/env.ts para centralizar la configuración.

La implementación fue revisada y validada mediante la ejecución de las pruebas. Las decisiones técnicas, los ajustes y la lógica de automatización fueron comprendidos y verificados durante el desarrollo, por lo que puedo explicar y modificar los componentes del proyecto de manera independiente.