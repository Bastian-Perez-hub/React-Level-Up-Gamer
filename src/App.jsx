import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import AdminProductos from './pages/AdminProductos'
import LoginTeam from './pages/LoginTeam'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/team" element={<LoginTeam />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App