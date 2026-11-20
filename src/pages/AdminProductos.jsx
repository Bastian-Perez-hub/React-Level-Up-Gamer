import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'          // <-- agrega esta línea
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../services/productoServices'
// Valores iniciales del formulario (todo texto, porque los inputs entregan texto)
const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
}

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)

  // null = estamos creando. Si tiene un código, estamos editando ese producto.
  const [codigoEditando, setCodigoEditando] = useState(null)

  // Carga inicial: se ejecuta una sola vez al abrir la página
  useEffect(() => {
    obtenerProductos()
      .then((datos) => {
        setProductos(datos)
      })
      .catch((error) => {
        setMensaje(`No se pudieron cargar los productos: ${error.message}`)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  // Vuelve a pedir la lista al servicio (después de crear, editar o eliminar)
  async function recargar() {
    const datos = await obtenerProductos()
    setProductos(datos)
  }

  function manejarCambio(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value })
  }

  function limpiarFormulario() {
    setFormulario(FORMULARIO_VACIO)
    setCodigoEditando(null)
  }

  // CREATE o UPDATE, según el modo en que estemos
  async function manejarEnvio(evento) {
    evento.preventDefault()

    try {
      if (codigoEditando === null) {
        await crearProducto(formulario)
        setMensaje(`Producto ${formulario.codigo.trim().toUpperCase()} creado`)
      } else {
        await actualizarProducto(codigoEditando, formulario)
        setMensaje(`Producto ${codigoEditando} actualizado`)
      }

      limpiarFormulario()
      await recargar()
    } catch (error) {
      setMensaje(error.message)
    }
  }

  // Carga los datos del producto en el formulario para modificarlo
  function empezarEdicion(producto) {
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      stock: String(producto.stock),
    })
    setCodigoEditando(producto.codigo)
    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function manejarEliminar(producto) {
    const confirmado = window.confirm(`¿Seguro que quieres eliminar "${producto.nombre}"?`)

    if (!confirmado) {
      return
    }

    try {
      await eliminarProducto(producto.codigo)
      setMensaje(`Producto ${producto.codigo} eliminado`)

      // Si justo estaba editando el producto que borró, cancelamos la edición
      if (producto.codigo === codigoEditando) {
        limpiarFormulario()
      }

      await recargar()
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const editando = codigoEditando !== null

  return (
    <>
      <h2 className="section-title">Administrar Productos</h2>
      <AdminNav />
      <section className="admin-form">
        <h3>{editando ? `Modificar producto ${codigoEditando}` : 'Nuevo producto'}</h3>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="codigo">Código</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                placeholder="Ej: JM003"
                value={formulario.codigo}
                onChange={manejarCambio}
                disabled={editando}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio (CLP)</label>
              <input
                type="number"
                id="precio"
                name="precio"
                min="1"
                value={formulario.precio}
                onChange={manejarCambio}
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                value={formulario.stock}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="admin-form-buttons">
            <button type="submit" className="btn">
              {editando ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {editando && (
              <button type="button" className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {mensaje !== '' && <p className="admin-message">{mensaje}</p>}

      {cargando ? (
        <p className="section-title">Cargando productos...</p>
      ) : (
        <div className="admin-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay productos registrados</td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.codigo}>
                    <td>{producto.codigo}</td>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio.toLocaleString('es-CL')}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => empezarEdicion(producto)}
                        >
                          Modificar
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => manejarEliminar(producto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminProductos