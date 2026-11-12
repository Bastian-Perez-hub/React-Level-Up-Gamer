import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productoServices'

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProductos().then((datos) => {
      setProductos(datos)
      setCargando(false)
    })
  }, [])

  return (
    <>
      <h2 className="section-title">Catálogo de Productos</h2>
      {cargando ? (
        <p className="section-title">Cargando productos...</p>
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