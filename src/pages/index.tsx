import { ZustandProvider } from 'state/zustand'
import Abel from './abel'
import { AuthContextProvider } from 'hooks/useAuthContext'
import LoginPage from './LoginModal'

function Home() {
  return (
    <AuthContextProvider>
      <Abel />
    </AuthContextProvider>
  )
}

export default Home
