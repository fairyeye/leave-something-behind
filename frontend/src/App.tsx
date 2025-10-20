import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Legacy from './pages/Legacy'
import { Button } from './components/ui/button'

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  return (
    <div>
      <header className="border-b">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="font-semibold">Emergency Legacy</Link>
          <nav className="flex items-center gap-3">
            <Link to="/">Home</Link>
            {user && <Link to="/legacy">Legacy</Link>}
            {user && <Link to="/profile">Profile</Link>}
            {user ? (
              <Button variant="ghost" onClick={logout}>Logout</Button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Protected><Profile/></Protected>} />
          <Route path="/legacy" element={<Protected><Legacy/></Protected>} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
