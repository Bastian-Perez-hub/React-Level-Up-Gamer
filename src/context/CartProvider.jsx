import { useEffect, useReducer } from 'react'
import { CartContext } from './CartContext'

const CLAVE_STORAGE = 'levelup-carrito'

// Lee el carrito guardado (si existe y no está corrupto)
function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// items = [{ codigo, cantidad }]
function carritoReducer(items, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const { codigo, cantidad, stock } = accion
      const existente = items.find((item) => item.codigo === codigo)
      const nuevaCantidad = Math.min((existente?.cantidad ?? 0) + cantidad, stock)

      if (nuevaCantidad <= 0) return items

      if (existente) {
        return items.map((item) =>
          item.codigo === codigo ? { ...item, cantidad: nuevaCantidad } : item
        )
      }
      return [...items, { codigo, cantidad: nuevaCantidad }]
    }

    case 'cambiarCantidad': {
      const { codigo, cantidad, stock } = accion

      if (cantidad <= 0) {
        return items.filter((item) => item.codigo !== codigo)
      }
      return items.map((item) =>
        item.codigo === codigo
          ? { ...item, cantidad: Math.min(cantidad, stock) }
          : item
      )
    }

    case 'quitar':
      return items.filter((item) => item.codigo !== accion.codigo)

    case 'vaciar':
      return []

    default:
      return items
  }
}

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, [], cargarCarrito)

  // Cada vez que cambia el carrito, lo guardamos
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
    } catch {
      // si el navegador no deja guardar, el carrito igual funciona en memoria
    }
  }, [items])

  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0)

  const valor = {
    items,
    cantidadTotal,
    agregar: (codigo, cantidad, stock) =>
      dispatch({ tipo: 'agregar', codigo, cantidad, stock }),
    cambiarCantidad: (codigo, cantidad, stock) =>
      dispatch({ tipo: 'cambiarCantidad', codigo, cantidad, stock }),
    quitar: (codigo) => dispatch({ tipo: 'quitar', codigo }),
    vaciar: () => dispatch({ tipo: 'vaciar' }),
  }

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export default CartProvider