const CLAVE = 'levelup_team_sesion'

export function iniciarSesionTeam() {
  sessionStorage.setItem(CLAVE, 'true')
}

export function cerrarSesionTeam() {
  sessionStorage.removeItem(CLAVE)
}

export function haySesionTeam() {
  return sessionStorage.getItem(CLAVE) === 'true'
}
