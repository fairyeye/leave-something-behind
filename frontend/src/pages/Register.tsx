import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const Register: React.FC = () => {
  const { register } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) {
      setError('两次输入的密码不一致')
      return
    }
    try {
      await register(username, email, password)
      setSuccess('注册成功，现在可以登录。')
      setTimeout(() => nav('/login'), 800)
    } catch (e: any) {
      setError(e?.response?.data?.message || '注册失败')
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">注册</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">用户名</Label>
          <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">密码</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <p className="text-xs text-gray-500">至少 8 位，包含字母和数字。</p>
        </div>
        <div>
          <Label htmlFor="confirm">确认密码</Label>
          <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <Button type="submit" className="w-full">创建账号</Button>
      </form>
      <p className="mt-4 text-sm">已经有账号了？<Link className="text-blue-600" to="/login">去登录</Link></p>
    </div>
  )
}

export default Register
