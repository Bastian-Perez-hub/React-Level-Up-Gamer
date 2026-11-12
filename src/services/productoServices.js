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