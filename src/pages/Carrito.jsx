import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCarts'
import { obtenerProductos } from '../services/productoServices'
import { crearCompra } from '../services/compraServices'

function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')} CLP`
}

function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar } = useCart()
  const [catalogo, setCatalogo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [comprando, setComprando] = useState(false)
  const [error, setError] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  useEffect(() => {
    let activo = true
    obtenerProductos()
      .then((datos) => {
        if (!activo) return
        setCatalogo(datos)

        // Sincroniza el carrito guardado con el estado real del backend
        items.forEach((item) => {
          const producto = datos.find((p) => p.codigo === item.codigo)
          if (!producto || producto.stock <= 0) {
            quitar(item.codigo)
            return
          }
          if (item.cantidad > producto.stock) {
            cambiarCantidad(item.codigo, producto.stock, producto.stock)
          }
        })
      })
      .catch((e) => {
        if (activo) setErrorCarga(e.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // El carrito solo guarda { codigo, cantidad }.
  // Aquí lo cruzamos con el catálogo para obtener nombre, precio e imagen.
  const lineas = items
    .map((item) => {
      const producto = catalogo.find((p) => p.codigo === item.codigo)
      if (!producto) return null
      return {
        ...producto,
        cantidad: item.cantidad,
        subtotal: producto.precio * item.cantidad,
      }
    })
    .filter(Boolean)

  const totalUnidades = lineas.reduce((suma, linea) => suma + linea.cantidad, 0)
  const total = lineas.reduce((suma, linea) => suma + linea.subtotal, 0)

  async function manejarCompra() {
    setComprando(true)
    setError('')

    try {
      const compra = await crearCompra(items)
      // Guardamos una "foto" de lo comprado usando la respuesta del backend
      const lineasConfirmacion = (compra.items || []).map((detalle) => {
        const producto = catalogo.find((p) => p.codigo === detalle.codigo)
        return {
          codigo: detalle.codigo,
          nombre: producto?.nombre ?? detalle.codigo,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal ?? (detalle.precioUnitario ?? 0) * detalle.cantidad,
        }
      })
      setConfirmacion({
        compra,
        lineas: lineasConfirmacion.length ? lineasConfirmacion : lineas,
        total: compra.total ?? total,
      })
      vaciar()
    } catch (e) {
      setError(e.message)
      // Refresca catálogo para reflejar stock/precios reales tras un fallo (ej. 409)
      try {
        const datos = await obtenerProductos()
        setCatalogo(datos)
      } catch {
        // se mantiene el catálogo actual si falla la recarga
      }
    } finally {
      setComprando(false)
    }
  }

  if (cargando) {
    return <h2 className="section-title">Cargando carrito...</h2>
  }

  if (errorCarga) {
    return <h2 className="section-title">No se pudo cargar el carrito: {errorCarga}</h2>
  }

  // Pantalla de confirmación después de comprar
  if (confirmacion) {
    return (
      <section className="cart-page">
        <div className="purchase-success">
          <h2>¡Compra realizada!</h2>
          <p className="purchase-id">
            Pedido N° {String(confirmacion.compra.id).padStart(4, '0')}
          </p>

          <ul className="purchase-detail">
            {confirmacion.lineas.map((linea) => (
              <li key={linea.codigo}>
                <span>
                  {linea.cantidad} × {linea.nombre}
                </span>
                <span>{formatearPrecio(linea.subtotal)}</span>
              </li>
            ))}
          </ul>

          <p className="purchase-total">
            <span>Total</span>
            <span>{formatearPrecio(confirmacion.total)}</span>
          </p>

          <Link to="/productos" className="btn-primary">
            Seguir comprando
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <h2 className="section-title">Carrito de Compras</h2>

      {lineas.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn-primary">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {lineas.map((linea) => (
              <li key={linea.codigo} className="cart-item">
                <img
                  src={`/img/${linea.codigo}.png`}
                  alt={linea.nombre}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <h3>{linea.nombre}</h3>
                  <p className="cart-item-unit">
                    {formatearPrecio(linea.precio)} c/u
                  </p>
                </div>

                <div className="qty-selector">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      cambiarCantidad(linea.codigo, linea.cantidad - 1, linea.stock)
                    }
                    disabled={linea.cantidad <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="qty-value">{linea.cantidad}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      cambiarCantidad(linea.codigo, linea.cantidad + 1, linea.stock)
                    }
                    disabled={linea.cantidad >= linea.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-subtotal">
                  {formatearPrecio(linea.subtotal)}
                </p>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => quitar(linea.codigo)}
                  aria-label={`Quitar ${linea.nombre} del carrito`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <aside className="cart-summary">
            <h3>Resumen</h3>
            <p className="cart-summary-row">
              <span>Productos</span>
              <span>{totalUnidades}</span>
            </p>
            <p className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>{formatearPrecio(total)}</span>
            </p>

            {error && <p className="cart-error">{error}</p>}

            <button
              type="button"
              className="btn cart-buy"
              onClick={manejarCompra}
              disabled={comprando}
            >
              {comprando ? 'Procesando...' : 'Comprar'}
            </button>
            <button
              type="button"
              className="cart-clear"
              onClick={vaciar}
              disabled={comprando}
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Carrito