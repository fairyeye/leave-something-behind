import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const Profile: React.FC = () => {
  const { user, refreshMe } = useAuth()
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { setUsername(user?.username || ''); setEmail(user?.email || '') }, [user])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.put('/api/user/update', { username, email })
      await refreshMe()
      setMessage('资料已更新')
    } catch (e: any) {
      setError(e?.response?.data?.message || '更新失败')
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">个人资料</h1>
      <div className="mb-4 text-sm text-gray-600">用户ID：{user.id} • 注册时间：{new Date(user.createdAt).toLocaleString('zh-CN')}</div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">用户名</Label>
          <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <Button type="submit">保存</Button>
      </form>
    </div>
  )
}

export default Profile
