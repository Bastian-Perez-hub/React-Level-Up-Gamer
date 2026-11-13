/*
 * TODO(backend): PRODUCTOS
 * ------------------------------------------------------------------
 * Hoy los productos salen de data/productos.js y el stock se descuenta
 * en memoria. Hay que reemplazarlo por llamadas reales.
 *
 * ENDPOINTS:
 *   GET    /api/productos           -> lista de productos
 *   GET    /api/productos/{codigo}  -> un producto (404 si no existe)
 *   POST   /api/productos           -> crear producto (admin)
 *   PUT    /api/productos/{codigo}  -> editar producto (admin)
 *   DELETE /api/productos/{codigo}  -> eliminar producto (admin)
 *
 * MODELO (el mismo que usa el frontend hoy):
 *   { codigo, nombre, descripcion, precio, stock }
 *
 * IMÁGENES: el frontend usa /img/{codigo}.png desde la carpeta public.
 *   Si el backend las sirve, agregar un campo "imagen" al modelo.
 *
 * AL CONECTAR EL BACKEND, EN EL FRONTEND:
 *   - Cada función pasa a usar fetch.
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

// ======================================================================
// CRUD DE ADMINISTRACIÓN (MOCK)
// Con backend, cada función pasa a ser un fetch:
//   crearProducto      -> POST   /api/productos
//   actualizarProducto -> PUT    /api/productos/{codigo}
//   eliminarProducto   -> DELETE /api/productos/{codigo}
// ======================================================================

// Revisa los datos de un producto. Con backend, esto lo valida también el servidor.
function validarProducto(datos) {
  if (datos.nombre.trim() === '') {
    throw new Error('El nombre es obligatorio')
  }
  if (datos.descripcion.trim() === '') {
    throw new Error('La descripción es obligatoria')
  }

  const precio = Number(datos.precio)
  if (!Number.isInteger(precio) || precio <= 0) {
    throw new Error('El precio debe ser un número entero mayor a 0')
  }

  const stock = Number(datos.stock)
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero, 0 o mayor')
  }
}

// CREATE
export async function crearProducto(datos) {
  const codigo = datos.codigo.trim().toUpperCase()

  if (codigo === '') {
    throw new Error('El código es obligatorio')
  }
  if (inventario.some((p) => p.codigo === codigo)) {
    throw new Error(`Ya existe un producto con el código ${codigo}`)
  }
  validarProducto(datos)

  const nuevo = {
    codigo,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
  }

  inventario.push(nuevo)
  return { ...nuevo }
}

// UPDATE (el código no se puede cambiar: es el identificador del producto)
export async function actualizarProducto(codigo, datos) {
  const producto = inventario.find((p) => p.codigo === codigo)

  if (!producto) {
    throw new Error(`El producto ${codigo} no existe`)
  }
  validarProducto(datos)

  producto.nombre = datos.nombre.trim()
  producto.descripcion = datos.descripcion.trim()
  producto.precio = Number(datos.precio)
  producto.stock = Number(datos.stock)

  return { ...producto }
}

// DELETE
export async function eliminarProducto(codigo) {
  const indice = inventario.findIndex((p) => p.codigo === codigo)

  if (indice === -1) {
    throw new Error(`El producto ${codigo} no existe`)
  }

  inventario.splice(indice, 1)
}