# Pendientes para el backend

Estado: el frontend del carrito está terminado y funciona con servicios
simulados (mock). Falta reemplazarlos por un backend real.

## Endpoints necesarios

| Método | Ruta                     | Descripción                          |
|--------|--------------------------|--------------------------------------|
| GET    | /api/productos           | Lista de productos con precio y stock |
| GET    | /api/productos/{codigo}  | Un producto                           |
| POST   | /api/compras             | Registra una compra                   |
| PUT    | /api/productos/{codigo}  | (Futuro) Admin: editar precio y stock |

## Modelos

    Producto      { codigo, nombre, descripcion, precio, stock }
    DetalleCompra { codigo, cantidad }                 // lo que envía el frontend
    Compra        { id, fecha, items[], total }        // lo que responde el servidor

## POST /api/compras

Request:

    { "items": [ { "codigo": "JM001", "cantidad": 2 } ] }

Respuesta 201:

    {
      "id": 1,
      "fecha": "2026-11-12T19:30:00Z",
      "items": [
        { "codigo": "JM001", "cantidad": 2, "precioUnitario": 29990, "subtotal": 59980 }
      ],
      "total": 59980
    }

Errores (con un campo "mensaje" legible para el usuario):

- 400: items vacío, cantidad <= 0 o no entera
- 404: algún producto no existe
- 409: stock insuficiente

## Reglas del servidor

- No confiar en precios del cliente: el servidor calcula subtotales y total.
- Validar todos los items antes de descontar; si uno falla, no se descuenta nada.
- Descontar stock en la misma transacción que crea la compra.
- Controlar la concurrencia sobre la última unidad de un producto.
- Guardar el precio unitario en el detalle para mantener el historial.

## Pendientes en el frontend al conectar

- [ ] `productoService.js`: reemplazar por fetch y borrar `inventario` y `descontarStock`.
- [ ] `compraService.js`: reemplazar por `POST /api/compras` y manejar errores HTTP.
- [ ] Variable de entorno `VITE_API_URL` y CORS (o proxy en `vite.config.js`).
- [ ] Revisar el carrito guardado en localStorage: si el precio o el stock
      cambiaron, ajustar o quitar items al cargar.

## Ideas para después

- Asociar la compra a un usuario (hoy solo existe el formulario de registro).
- Descuento para correos @duocuc.cl: hoy es solo un mensaje en el registro;
  el servidor debería aplicarlo al calcular el total.
- Historial de compras del usuario.