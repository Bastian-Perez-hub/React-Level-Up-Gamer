import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import { obtenerCompras } from '../services/compraServices'
import { obtenerProductos } from '../services/productoServices'

function formatearPesos(valor) {
  return `$${Number(valor).toLocaleString('es-CL')}`
}

function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function AdminVentas() {
  const [compras, setCompras] = useState([])
  const [nombres, setNombres] = useState({}) // codigo -> nombre del producto
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [abierta, setAbierta] = useState(null) // id de la compra con detalle desplegado

  useEffect(() => {
    obtenerCompras()
      .then((datos) => {
        setCompras(datos)
      })
      .catch((error) => {
        setMensaje(`No se pudieron cargar las ventas: ${error.message}`)
      })
      .finally(() => {
        setCargando(false)
      })

    // Los nombres son un extra: si falla, se muestran solo los códigos
    obtenerProductos()
      .then((productos) => {
        const mapa = {}
        productos.forEach((p) => {
          mapa[p.codigo] = p.nombre
        })
        setNombres(mapa)
      })
      .catch(() => {})
  }, [])

  const totalVendido = compras.reduce((suma, c) => suma + c.total, 0)
  const unidadesVendidas = compras.reduce(
    (suma, c) => suma + c.items.reduce((s, i) => s + i.cantidad, 0),
    0,
  )

  function alternarDetalle(id) {
    setAbierta(abierta === id ? null : id)
  }

  return (
    <>
      <h2 className="section-title">Ventas</h2>
      <AdminNav />

      {mensaje !== '' && <p className="admin-message">{mensaje}</p>}

      {cargando ? (
        <p className="section-title">Cargando ventas...</p>
      ) : (
        <>
          <section className="admin-resumen">
            <div className="admin-resumen-card">
              <span>Compras</span>
              <strong>{compras.length}</strong>
            </div>
            <div className="admin-resumen-card">
              <span>Unidades vendidas</span>
              <strong>{unidadesVendidas}</strong>
            </div>
            <div className="admin-resumen-card">
              <span>Total vendido</span>
              <strong>{formatearPesos(totalVendido)}</strong>
            </div>
          </section>

          <div className="admin-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {compras.length === 0 ? (
                  <tr>
                    <td colSpan="5">Aún no hay ventas registradas</td>
                  </tr>
                ) : (
                  compras.map((compra) => (
                    <FilaCompra
                      key={compra.id}
                      compra={compra}
                      nombres={nombres}
                      abierta={abierta === compra.id}
                      onAlternar={() => alternarDetalle(compra.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

function FilaCompra({ compra, nombres, abierta, onAlternar }) {
  const cantidadItems = compra.items.reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <>
      <tr>
        <td>#{compra.id}</td>
        <td>{formatearFecha(compra.fecha)}</td>
        <td>{cantidadItems}</td>
        <td>{formatearPesos(compra.total)}</td>
        <td>
          <button type="button" className="btn-secondary" onClick={onAlternar}>
            {abierta ? 'Ocultar' : 'Ver'}
          </button>
        </td>
      </tr>
      {abierta && (
        <tr className="admin-detalle">
          <td colSpan="5">
            <ul>
              {compra.items.map((item) => (
                <li key={item.codigo}>
                  {nombres[item.codigo] ?? item.codigo} ({item.codigo}) — {item.cantidad} ×{' '}
                  {formatearPesos(item.precioUnitario)} = {formatearPesos(item.subtotal)}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  )
}

export default AdminVentas