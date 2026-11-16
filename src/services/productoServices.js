import { apiFetch } from './api'

export async function obtenerProductos() {
  return apiFetch('/api/productos')
}

export async function obtenerProductoPorCodigo(codigo) {
  try {
    return await apiFetch(`/api/productos/${encodeURIComponent(codigo)}`)
  } catch (error) {
    if (error.message.includes('no existe')) {
      return null
    }
    throw error
  }
}

export async function crearProducto(datos) {
  return apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify({
      codigo: datos.codigo?.trim().toUpperCase(),
      nombre: datos.nombre?.trim(),
      descripcion: datos.descripcion?.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
    }),
  })
}

export async function actualizarProducto(codigo, datos) {
  return apiFetch(`/api/productos/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: datos.nombre?.trim(),
      descripcion: datos.descripcion?.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
    }),
  })
}

export async function eliminarProducto(codigo) {
  await apiFetch(`/api/productos/${encodeURIComponent(codigo)}`, {
    method: 'DELETE',
  })
}
