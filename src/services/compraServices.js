import { apiFetch } from './api'

// items = [{ codigo, cantidad }]
export async function crearCompra(items) {
  const detalles = items.map(({ codigo, cantidad }) => ({
    codigo,
    cantidad: Number(cantidad),
  }))

  return apiFetch('/api/compras', {
    method: 'POST',
    body: JSON.stringify({ items: detalles }),
  })
  
}
// Lista todas las compras (más recientes primero). Solo para el panel admin.
export async function obtenerCompras() {
  return apiFetch('/api/compras')
}
