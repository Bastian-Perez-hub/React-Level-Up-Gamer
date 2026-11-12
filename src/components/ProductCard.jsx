import { useCart } from '../hooks/useCarts'

function ProductCard({ codigo, nombre, descripcion, precio, stock }) {
  const { items, agregar, cambiarCantidad } = useCart()

  const precioFormateado = precio.toLocaleString('es-CL')

  // Cuántas unidades de este producto hay en el carrito
  const enCarrito = items.find((item) => item.codigo === codigo)?.cantidad ?? 0

  return (
    <li className="product-card">
      <img src={`/img/${codigo}.png`} alt={nombre} className="product-img" />
      <h3>{nombre}</h3>
      <p className="product-desc">{descripcion}</p>
      <p className="product-price">${precioFormateado} CLP</p>
      <p className="product-stock">
        {stock === 0 ? 'Sin stock' : `Stock: ${stock}`}
      </p>

      <div className="product-actions">
        {stock === 0 ? (
          <button className="btn" disabled>
            Agotado
          </button>
        ) : enCarrito === 0 ? (
          <button className="btn" onClick={() => agregar(codigo, 1, stock)}>
            Agregar al Carrito
          </button>
        ) : (
          <div className="qty-selector">
            <button
              type="button"
              className="qty-btn"
              onClick={() => cambiarCantidad(codigo, enCarrito - 1, stock)}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="qty-value">{enCarrito}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => cambiarCantidad(codigo, enCarrito + 1, stock)}
              disabled={enCarrito >= stock}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

export default ProductCard