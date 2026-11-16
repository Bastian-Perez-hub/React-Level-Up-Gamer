const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function parsearCuerpo(respuesta) {
  const texto = await respuesta.text()
  if (!texto) return null
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

export async function apiFetch(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
    ...opciones,
  })

  if (respuesta.status === 204) {
    return null
  }

  const datos = await parsearCuerpo(respuesta)

  if (!respuesta.ok) {
    const mensaje =
      datos && typeof datos === 'object' && 'mensaje' in datos
        ? datos.mensaje
        : `Error ${respuesta.status}`
    throw new Error(mensaje)
  }

  return datos
}
