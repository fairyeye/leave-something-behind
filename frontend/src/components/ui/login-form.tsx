import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useAuth } from "../../auth"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./field"
import { Input } from "./input"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(identifier, password)
      navigate("/")
    } catch (e: any) {
      setError(e?.response?.data?.message || "登录失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>登录到你的账号</CardTitle>
          <CardDescription>请输入邮箱或用户名和密码以登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="identifier">邮箱或用户名</FieldLabel>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com 或用户名"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    忘记密码？
                  </a>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              {error && (
                <Field>
                  <FieldDescription className="text-red-600">{error}</FieldDescription>
                </Field>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "登录中..." : "登录"}
                </Button>
                <Button variant="outline" type="button" disabled>
                  使用 Google 登录
                </Button>
                <FieldDescription className="text-center">
                  还没有账号？ <Link to="/register">去注册</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
