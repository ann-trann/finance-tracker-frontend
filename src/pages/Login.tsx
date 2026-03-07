import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthLayout from "../components/auth/AuthLayout"
import AuthForm from "../components/auth/AuthForm"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Fintrack account"
    >
      <AuthForm
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        buttonText="Sign In"
        loadingText="Signing in..."
        fields={[
          {
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
            value: email,
            onChange: setEmail,
          },
          {
            label: "Password",
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: setPassword,
          },
        ]}
      />

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  )
}

export default Login