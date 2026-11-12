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