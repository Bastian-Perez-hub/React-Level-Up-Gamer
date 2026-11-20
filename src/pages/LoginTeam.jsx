import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesionTeam } from '../utils/sesionTeam'   // <-- CAMBIO 1: import nuevo

function LoginTeam() {
  const [datos, setDatos] = useState({
    usuario: '',
    contrasena: '',
  })
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    if (datos.usuario.trim() === '' || datos.contrasena.trim() === '') {
      setMensaje('Debe ingresar usuario y contraseña')
      return
    }

    // MOCK: cualquier credencial es válida.
    // Con backend, aquí se haría un POST /api/login y se revisaría el rol.
    iniciarSesionTeam()                                    // <-- CAMBIO 2: guarda la sesión
    navigate('/admin/productos')
  }

  return (
    <section className="login">
      <div className="register-card">
        <h2>Nuestro team</h2>
        <p className="register-subtitle">Acceso para el equipo Level-Up Gamer</p>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={datos.usuario}
              onChange={manejarCambio}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={datos.contrasena}
              onChange={manejarCambio}
            />
          </div>

          <button type="submit" className="btn-registrar">Ingresar</button>
          <p className="form-message">{mensaje}</p>
        </form>
      </div>
    </section>
  )
}

export default LoginTeam