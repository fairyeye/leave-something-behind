import React from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

type LegacyItem = {
  id: number
  category: 'ASSET' | 'ACCOUNT' | 'MESSAGE' | 'OTHER'
  title: string
  content: string
  updatedAt: string
}

const Home: React.FC = () => {
  const { user } = useAuth()
  const [items, setItems] = React.useState<LegacyItem[]>([])

  React.useEffect(() => {
    if (!user) return
    api.get('/api/legacy').then(res => setItems(res.data)).catch(() => {})
  }, [user])

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">欢迎使用「Leave Something Behind」</CardTitle>
            <CardDescription>
              在紧急情况下与家人共享的重要信息：资产、账号以及心里话，请提前记录与管理。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Link to="/login"><Button>登录</Button></Link>
              <Link to="/register"><Button variant="secondary">注册</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const total = items.length
  const counts = items.reduce(
    (acc, it) => {
      acc[it.category] = (acc[it.category] || 0) + 1
      return acc
    },
    { ASSET: 0, ACCOUNT: 0, MESSAGE: 0, OTHER: 0 } as Record<LegacyItem['category'], number>
  )
  const recent = [...items].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">仪表盘</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">你好，{user.username}。这是你数据的概览。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>总条目</CardTitle>
            <CardDescription>你记录的所有传承信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>资产</CardTitle>
            <CardDescription>资产类条目数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.ASSET}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>账号</CardTitle>
            <CardDescription>线上账号类条目数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.ACCOUNT}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>留言</CardTitle>
            <CardDescription>心里话/留言数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.MESSAGE}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>最近更新</CardTitle>
            <CardDescription>最近 5 条更新的传承信息</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-sm text-gray-500">暂无数据，去添加你的第一条传承信息吧。</div>
            ) : (
              <div className="space-y-3">
                {recent.map((it) => (
                  <div key={it.id} className="rounded-md border p-3 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-gray-500">{new Date(it.updatedAt).toLocaleString('zh-CN')}</div>
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{it.content}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link to="/legacy"><Button variant="outline">查看全部</Button></Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link to="/legacy"><Button>管理传承信息</Button></Link>
              <Link to="/profile"><Button variant="secondary">个人资料</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home
