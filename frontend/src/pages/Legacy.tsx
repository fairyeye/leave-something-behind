import React, { useEffect, useState } from 'react'
import api from '../api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { ConfirmDialog } from '../components/ui/confirm-dialog'

export type LegacyItem = {
  id: number
  category: 'ASSET' | 'ACCOUNT' | 'MESSAGE' | 'OTHER'
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const categories = ['ASSET', 'ACCOUNT', 'MESSAGE', 'OTHER'] as const
const categoryLabels: Record<LegacyItem['category'], string> = {
  ASSET: '资产',
  ACCOUNT: '账号',
  MESSAGE: '留言',
  OTHER: '其他',
}

const Legacy: React.FC = () => {
  const [items, setItems] = useState<LegacyItem[]>([])
  const [category, setCategory] = useState<LegacyItem['category']>('ASSET')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

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
      setError(e?.response?.data?.message || '保存失败')
    }
  }

  const onEdit = (it: LegacyItem) => {
    setEditingId(it.id)
    setCategory(it.category)
    setTitle(it.title)
    setContent(it.content)
  }

  const requestDelete = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    await api.delete(`/api/legacy/${deleteId}`)
    await load()
    setDeleteId(null)
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">我的传承信息</h1>
      <form onSubmit={onCreateOrUpdate} className="mb-8 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>分类</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
            {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>标题</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <Label>内容</Label>
          <Textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit">{editingId ? '更新' : '添加'}条目</Button>
          {editingId && <Button type="button" variant="ghost" className="ml-2" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setCategory('ASSET') }}>取消</Button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-gray-500">还没有任何记录，请在上方添加你的第一条传承信息。</p>}
        {items.map(it => (
          <div key={it.id} className="rounded-md border p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">{categoryLabels[it.category]}</div>
                <h3 className="text-lg font-semibold">{it.title}</h3>
              </div>
              <div className="text-sm text-gray-500">更新于：{new Date(it.updatedAt).toLocaleString('zh-CN')}</div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{it.content}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => onEdit(it)}>编辑</Button>
              <Button size="sm" variant="destructive" onClick={() => requestDelete(it.id)}>删除</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId != null}
        title="确认删除该条目？"
        description="删除后不可恢复。"
        cancelText="取消"
        confirmText="删除"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default Legacy
