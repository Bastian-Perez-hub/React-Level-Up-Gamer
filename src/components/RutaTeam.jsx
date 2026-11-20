import { Navigate } from 'react-router-dom'
import { haySesionTeam } from '../utils/sesionTeam'

function RutaTeam({ children }) {
  if (!haySesionTeam()) {
    return <Navigate to="/team" replace />
  }
  return children
}

export default RutaTeam