import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button } from '../components/ui/button'

const Home: React.FC = () => {
  const { user } = useAuth()
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Welcome to Emergency Legacy</h1>
      <p className="text-gray-600 dark:text-gray-300">Record important information to be shared with your family in case of emergencies: assets, accounts, and heartfelt messages.</p>
      {user ? (
        <div className="flex gap-3"><Link to="/legacy"><Button>Manage Legacy Info</Button></Link><Link to="/profile"><Button variant="secondary">Profile</Button></Link></div>
      ) : (
        <div className="flex gap-3"><Link to="/login"><Button>Login</Button></Link><Link to="/register"><Button variant="secondary">Register</Button></Link></div>
      )}
    </div>
  )
}

export default Home
