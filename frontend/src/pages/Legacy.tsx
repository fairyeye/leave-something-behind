import React, { useEffect, useState } from 'react'
import api from '../api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'

export type LegacyItem = {
  id: number
  category: 'ASSET' | 'ACCOUNT' | 'MESSAGE' | 'OTHER'
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const categories = ['ASSET', 'ACCOUNT', 'MESSAGE', 'OTHER'] as const

const Legacy: React.FC = () => {
  const [items, setItems] = useState<LegacyItem[]>([])
  const [category, setCategory] = useState<LegacyItem['category']>('ASSET')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    const res = await api.get('/api/legacy')
    setItems(res.data)
  }

  useEffect(() => { load() }, [])

  const onCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.put(`/api/legacy/${editingId}`, { category, title, content })
      } else {
        await api.post('/api/legacy', { category, title, content })
      }
      setCategory('ASSET'); setTitle(''); setContent(''); setEditingId(null)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Save failed')
    }
  }

  const onEdit = (it: LegacyItem) => {
    setEditingId(it.id)
    setCategory(it.category)
    setTitle(it.title)
    setContent(it.content)
  }

  const onDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    await api.delete(`/api/legacy/${id}`)
    await load()
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">My Legacy Information</h1>
      <form onSubmit={onCreateOrUpdate} className="mb-8 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <Label>Content</Label>
          <Textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit">{editingId ? 'Update' : 'Add'} Item</Button>
          {editingId && <Button type="button" variant="ghost" className="ml-2" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setCategory('ASSET') }}>Cancel</Button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-gray-500">No items yet. Add your first legacy item above.</p>}
        {items.map(it => (
          <div key={it.id} className="rounded-md border p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">{it.category}</div>
                <h3 className="text-lg font-semibold">{it.title}</h3>
              </div>
              <div className="text-sm text-gray-500">Updated: {new Date(it.updatedAt).toLocaleString()}</div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{it.content}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => onEdit(it)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(it.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Legacy
