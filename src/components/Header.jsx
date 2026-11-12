import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCarts'

function IconoCarrito() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

function Header() {
  const { cantidadTotal } = useCart()

  return (
    <header>
      <Link to="/" className="logo">
        <span className="level-up">LEVEL-UP</span>
        <span className="gamer">GAMER</span>
      </Link>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/registro">Regístrate</Link></li>
          <li><Link to="/#proximo-evento">Eventos</Link></li>
          <li>
            <Link
              to="/carrito"
              className="cart-link"
              aria-label={`Carrito de compras, ${cantidadTotal} productos`}
            >
              <IconoCarrito />
              {cantidadTotal > 0 && (
                <span className="cart-badge">
                  {cantidadTotal > 99 ? '99+' : cantidadTotal}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header