/*
 * TODO(backend): PRODUCTOS
 * ------------------------------------------------------------------
 * Hoy los productos salen de data/productos.js y el stock se descuenta
 * en memoria. Hay que reemplazarlo por llamadas reales.
 *
 * ENDPOINTS:
 *   GET /api/productos           -> lista de productos
 *   GET /api/productos/{codigo}  -> un producto (404 si no existe)
 *
 * MODELO (el mismo que usa el frontend hoy):
 *   { codigo, nombre, descripcion, precio, stock }
 *
 * IMÁGENES: el frontend usa /img/{codigo}.png desde la carpeta public.
 *   Si el backend las sirve, agregar un campo "imagen" al modelo.
 *
 * PÁGINA DE ADMINISTRACIÓN (futura): usará este mismo modelo para
 * editar precio y stock, p. ej. PUT /api/productos/{codigo}.
 *   Solo debe poder hacerlo un usuario con rol administrador.
 *
 * AL CONECTAR EL BACKEND, EN EL FRONTEND:
 *   - obtenerProductos() y obtenerProductoPorCodigo() pasan a usar fetch.
 *   - Eliminar "inventario" y "descontarStock" (el servidor lo hace).
 *   - Definir la URL base en una variable de entorno (VITE_API_URL) y
 *     configurar CORS en el backend, o un proxy en vite.config.js.
 * ------------------------------------------------------------------
 */
import productos from '../data/productos'

// Copia en memoria del inventario. Es lo que baja al comprar.
// Se reinicia al recargar la página; con backend esto vive en la base de datos.
const inventario = productos.map((producto) => ({ ...producto }))

// Cuando exista el backend, solo hay que cambiar el cuerpo de estas
// funciones por un fetch y el resto de la app sigue funcionando igual.

export async function obtenerProductos() {
  return inventario.map((producto) => ({ ...producto }))
}

export async function obtenerProductoPorCodigo(codigo) {
  const producto = inventario.find((p) => p.codigo === codigo)
  return producto ? { ...producto } : null
}

// SOLO PARA EL MOCK: con backend, esto lo hace el servidor al registrar la compra.
export function descontarStock(detalles) {
  // Primero validamos todo, para no dejar la compra a medias
  for (const { codigo, cantidad } of detalles) {
    const producto = inventario.find((p) => p.codigo === codigo)
    if (!producto) {
      throw new Error(`El producto ${codigo} no existe`)
    }
    if (cantidad > producto.stock) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`)
    }
  }

  // Si todo está bien, descontamos
  for (const { codigo, cantidad } of detalles) {
    const producto = inventario.find((p) => p.codigo === codigo)
    producto.stock -= cantidad
  }
}