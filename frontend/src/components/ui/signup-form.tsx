import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./field"
import { Input } from "./input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password !== confirm) {
      setError("两次输入的密码不一致")
      return
    }
    setLoading(true)
    try {
      await register(username, email, password)
      setSuccess("注册成功，现在可以登录。")
      setTimeout(() => navigate("/login"), 800)
    } catch (e: any) {
      setError(e?.response?.data?.message || "注册失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>创建账号</CardTitle>
        <CardDescription>请输入信息以创建你的账号</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">用户名</FieldLabel>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">邮箱</FieldLabel>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
              <FieldDescription>我们不会与任何人分享你的邮箱。</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">密码</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <FieldDescription>至少 8 位，包含字母和数字。</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">确认密码</FieldLabel>
              <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              <FieldDescription>请再次输入你的密码。</FieldDescription>
            </Field>
            {error && (
              <Field>
                <FieldDescription className="text-red-600">{error}</FieldDescription>
              </Field>
            )}
            {success && (
              <Field>
                <FieldDescription className="text-green-600">{success}</FieldDescription>
              </Field>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "创建中..." : "创建账号"}
                </Button>
                <Button variant="outline" type="button" disabled>
                  使用 Google 注册
                </Button>
                <FieldDescription className="px-6 text-center">
                  已经有账号了？ <Link to="/login">去登录</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
