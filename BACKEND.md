# Backend e integración (Level-Up Gamer)

## Estado actual

- **Backend implementado** en `backend/` (Spring Boot, Java 21, Maven).
- **Frontend integrado** con la API mediante `fetch` (ver `src/services/api.js`, `src/services/productoServices.js`, `src/services/compraServices.js`).
- En desarrollo, Vite usa un **proxy** `/api -> http://localhost:8080` (`vite.config.js`). También se puede definir `VITE_API_URL` para apuntar a otra URL base.

## Cómo ejecutar

### Backend
Desde `React-Level-Up-Gamer/backend`:

```bash
./mvnw spring-boot:run
```

En Windows también puede usarse `mvnw.cmd spring-boot:run`.

- API: `http://localhost:8080`
- Consola H2: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:levelup`
  - Usuario: `sa`
  - Contraseña: *(vacía)*

### Frontend
Desde `React-Level-Up-Gamer`:

```bash
npm install
npm run dev
```

- App: `http://localhost:5173`

## Configuración relevante del backend

- Base de datos H2 en memoria (`spring.datasource.url=jdbc:h2:mem:levelup`).
- Hibernate crea el esquema (`spring.jpa.hibernate.ddl-auto=create-drop`).
- `data.sql` se ejecuta después de crear tablas y precarga los productos iniciales.
- CORS habilitado para `http://localhost:5173` en `/api/**` (`config/CorsConfig.java`).

## Endpoints disponibles

### Productos

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| GET | `/api/productos` | Lista productos | 200 + arreglo de productos |
| GET | `/api/productos/{codigo}` | Obtiene un producto | 200 + producto / 404 |
| POST | `/api/productos` | Crea producto (admin) | 201 + producto creado |
| PUT | `/api/productos/{codigo}` | Actualiza producto (admin) | 200 + producto actualizado |
| DELETE | `/api/productos/{codigo}` | Elimina producto (admin) | 204 |

### Compras

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| POST | `/api/compras` | Registra una compra | 201 + compra |
| GET | `/api/compras` | Lista compras (más recientes primero) | 200 + arreglo |
| GET | `/api/compras/{id}` | Obtiene una compra por id | 200 + compra / 404 |

## Contratos (JSON)

### Producto
```json
{
  "codigo": "JM001",
  "nombre": "Catan",
  "descripcion": "Un clásico juego de estrategia...",
  "precio": 29990,
  "stock": 10
}
```

### Crear/editar producto (`POST/PUT`)
```json
{
  "codigo": "JM003",         
  "nombre": "Nombre",
  "descripcion": "Descripción",
  "precio": 19990,
  "stock": 5
}
```
- `codigo` se usa al crear; en edición el identificador va en la URL (el backend no cambia el código).

### Crear compra (`POST /api/compras`)
Request:
```json
{
  "items": [
    { "codigo": "JM001", "cantidad": 2 }
  ]
}
```

Response 201:
```json
{
  "id": 1,
  "fecha": "2026-11-12T19:30:00Z",
  "items": [
    { "codigo": "JM001", "cantidad": 2, "precioUnitario": 29990, "subtotal": 59980 }
  ],
  "total": 59980
}
```

## Errores
Las respuestas de error del backend usan el formato:

```json
{ "mensaje": "Texto legible para el usuario" }
```

Casos principales:
- **400**: datos inválidos (validaciones, JSON/tipos inválidos, parámetros inválidos).
- **404**: recurso no encontrado (producto/compra).
- **409**: conflicto (código duplicado, stock insuficiente).

## Reglas de negocio implementadas en backend
- El servidor **calcula precios, subtotales y total** desde la base de datos (no confía en el cliente).
- Se validan todos los ítems antes de descontar stock.
- El descuento de stock y la creación de la compra se realizan en **transacción**.
- Control de concurrencia al descontar stock con actualización condicional (`stock >= cantidad`).
- Se guarda el **precio unitario** en el detalle de compra para preservar historial.

## Integración frontend (implementada)

- `src/services/api.js`: helper de `fetch` con manejo de JSON, errores `{ mensaje }` y soporte de `VITE_API_URL`.
- `src/services/productoServices.js`: CRUD de productos contra `/api/productos`.
- `src/services/compraServices.js`: `POST /api/compras`.
- `src/pages/Productos.jsx` y `src/pages/AdminProductos.jsx`: cargan datos desde la API y manejan errores.
- `src/pages/Carrito.jsx`: compra contra backend, muestra confirmación con datos reales y sincroniza el carrito local con catálogo/stock actual al cargar.

## Notas y pendientes futuros
- Asociar compras a usuarios/autenticación (hoy no existe flujo real).
- Aplicar descuentos (p. ej. correos `@duocuc.cl`) en el cálculo del servidor.
- Historial de compras en UI (el backend ya expone `GET /api/compras`).
- Mejorar política UX cuando cambia precio/stock de ítems guardados en `localStorage` (actualmente se ajustan/quitan según stock disponible al cargar el carrito).
- Si se despliega fuera de desarrollo, configurar `VITE_API_URL` y CORS/origen según el entorno.
