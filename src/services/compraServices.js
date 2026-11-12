/*
 * TODO(backend): COMPRAS
 * ------------------------------------------------------------------
 * Hoy esto es un MOCK: descuenta el stock en memoria y devuelve una
 * compra falsa. Hay que reemplazarlo por una llamada real.
 *
 * ENDPOINT: POST /api/compras
 *
 * REQUEST (lo único que envía el frontend):
 *   { "items": [ { "codigo": "JM001", "cantidad": 2 } ] }
 *
 * RESPUESTA 201 (la arma el servidor):
 *   {
 *     "id": 1,
 *     "fecha": "2026-11-12T19:30:00Z",
 *     "items": [
 *       { "codigo": "JM001", "cantidad": 2,
 *         "precioUnitario": 29990, "subtotal": 59980 }
 *     ],
 *     "total": 59980
 *   }
 *
 * ERRORES (el frontend muestra el campo "mensaje" al usuario):
 *   400 -> items vacío, cantidad <= 0 o no entera
 *   404 -> algún código de producto no existe
 *   409 -> stock insuficiente
 *
 * REGLAS QUE DEBE CUMPLIR EL SERVIDOR:
 *   - NUNCA confiar en precios del cliente: el servidor busca el precio
 *     en su base de datos y calcula subtotales y total.
 *   - Validar TODOS los items antes de descontar. Si uno falla, no se
 *     descuenta ninguno (usar una transacción).
 *   - Descontar el stock dentro de esa misma transacción.
 *   - Cuidar la concurrencia: si dos personas compran la última unidad
 *     al mismo tiempo, solo una debe lograrlo (bloqueo de fila o
 *     actualización condicional "stock >= cantidad").
 *   - Guardar el precio unitario en el detalle de la compra, así el
 *     historial no cambia si el precio del producto cambia después.
 *
 * AL CONECTAR EL BACKEND, EN EL FRONTEND:
 *   - Reemplazar el cuerpo de crearCompra() por el fetch.
 *   - Borrar descontarStock() e inventario de productoService.js.
 *   - Convertir los errores HTTP en Error(mensaje) para que Carrito.jsx
 *     los muestre (ya hace catch y muestra e.message).
 * ------------------------------------------------------------------
 */
import { descontarStock } from './productoServices'

let contador = 1

// items = [{ codigo, cantidad }]  (es el mismo formato del carrito)
// Cada elemento es un DetalleCompra: solo lleva el código y la cantidad.
export async function crearCompra(items) {
  const detalles = items.map(({ codigo, cantidad }) => ({ codigo, cantidad }))

  // Esto es lo que más adelante se enviará al backend
  console.log('Compra a enviar:', { items: detalles })

  // Simula el tiempo de respuesta de un servidor
  await new Promise((resolve) => setTimeout(resolve, 600))

  descontarStock(detalles)

  // Con backend, esto sería algo como:
  //   const respuesta = await fetch('/api/compras', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ items: detalles }),
  //   })
  //   if (!respuesta.ok) throw new Error('No se pudo realizar la compra')
  //   return respuesta.json()

  return {
    id: contador++,
    fecha: new Date().toISOString(),
    items: detalles,
  }
}