import { Routes, Route, useLocation } from 'react-router-dom'   // <-- agrega useLocation
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import AdminProductos from './pages/AdminProductos'
import AdminVentas from './pages/AdminVentas'
import LoginTeam from './pages/LoginTeam'
import RutaTeam from './components/RutaTeam'

function App() {
  const { pathname } = useLocation()               // <-- ruta actual, ej: "/admin/ventas"
  const esAdmin = pathname.startsWith('/admin')    // <-- true si estamos en administración

  return (
    <>
      {!esAdmin && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/admin/productos"
            element={<RutaTeam><AdminProductos /></RutaTeam>}
          />
          <Route
            path="/admin/ventas"
            element={<RutaTeam><AdminVentas /></RutaTeam>}
          />
          <Route path="/team" element={<LoginTeam />} />
        </Routes>
      </main>
      {!esAdmin && <Footer />}
    </>
  )
}

export default App