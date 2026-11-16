import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productoServices'

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerProductos()
      .then((datos) => {
        setProductos(datos)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  return (
    <>
      <h2 className="section-title">Catálogo de Productos</h2>
      {cargando ? (
        <p className="section-title">Cargando productos...</p>
      ) : error ? (
        <p className="section-title">No se pudieron cargar los productos: {error}</p>
      ) : (
        <ul className="grid-container">
          {productos.map((producto) => (
            <ProductCard
              key={producto.codigo}
              codigo={producto.codigo}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              stock={producto.stock}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default Productos
