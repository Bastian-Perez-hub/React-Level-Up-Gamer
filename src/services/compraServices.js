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
