import { NavLink, useNavigate } from 'react-router-dom'
import { cerrarSesionTeam } from '../utils/sesionTeam'

function AdminNav() {
  const navigate = useNavigate()

  function salir() {
    cerrarSesionTeam()
    navigate('/team')
  }

  return (
    <nav className="admin-nav">
      <NavLink to="/admin/productos" className="admin-nav-link">Productos</NavLink>
      <NavLink to="/admin/ventas" className="admin-nav-link">Ventas</NavLink>
      <button type="button" className="btn-secondary" onClick={salir}>Cerrar sesión</button>
    </nav>
  )
}

export default AdminNav