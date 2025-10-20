import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const Login: React.FC = () => {
  const { login } = useAuth()
  const nav = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(identifier, password)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || '登录失败')
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">登录</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="identifier">邮箱或用户名</Label>
          <Input id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">密码</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">登录</Button>
      </form>
      <p className="mt-4 text-sm">还没有账号？<Link className="text-blue-600" to="/register">去注册</Link></p>
    </div>
  )
}

export default Login
