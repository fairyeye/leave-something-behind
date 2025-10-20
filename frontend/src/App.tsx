import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Legacy from './pages/Legacy'
import { Button } from './components/ui/button'
import { ConfirmDialog } from './components/ui/confirm-dialog'

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  return (
    <div>
      <header className="border-b">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="font-semibold">Leave Something Behind</Link>
          <nav className="flex items-center gap-3">
            <Link to="/">首页</Link>
            {user && <Link to="/legacy">传承</Link>}
            {user && <Link to="/profile">个人资料</Link>}
            {user ? (
              <Button variant="ghost" onClick={() => setLogoutOpen(true)}>退出登录</Button>
            ) : (
              <Link to="/login">登录</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
      <ConfirmDialog
        open={logoutOpen}
        title="确认退出登录？"
        description="退出后需要重新登录才能访问个人数据。"
        cancelText="取消"
        confirmText="退出"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => { setLogoutOpen(false); logout() }}
      />
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
