import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthLayout from "../components/auth/AuthLayout"
import AuthForm from "../components/auth/AuthForm"

const Register: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your finances today"
    >
      <AuthForm
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        buttonText="Create Account"
        loadingText="Creating account..."
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
            placeholder: "Min. 6 characters",
            value: password,
            onChange: setPassword,
          },
          {
            label: "Confirm Password",
            type: "password",
            placeholder: "Repeat password",
            value: confirm,
            onChange: setConfirm,
          },
        ]}
      />

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}

export default Register