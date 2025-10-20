import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'

const Home: React.FC = () => {
  const { user } = useAuth()
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">欢迎使用「紧急传承」</h1>
      <p className="text-gray-600 dark:text-gray-300">在紧急情况下与家人共享的重要信息：资产、账号以及心里话，请提前记录与管理。</p>
      {user ? (
        <div className="flex gap-3"><Link to="/legacy"><Button>管理传承信息</Button></Link><Link to="/profile"><Button variant="secondary">个人资料</Button></Link></div>
      ) : (
        <div className="flex gap-3"><Link to="/login"><Button>登录</Button></Link><Link to="/register"><Button variant="secondary">注册</Button></Link></div>
      )}
    </div>
  )
}

export default Home
