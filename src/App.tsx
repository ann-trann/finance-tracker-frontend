import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Layout from "./components/layout/Layout"

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AddTransaction from "./pages/AddTransaction"
import TransactionList from "./pages/TransactionList"
import Wallets from "./pages/Wallet"
import WalletDetail from "./pages/WalletDetail"


const App: React.FC = () => {
  return (
    <AuthProvider>        {/* Global authentication context (user, token, login, logout) */}

      <BrowserRouter>     {/* Router that enables navigation between pages */}
        <Routes>          {/* Container for all route definitions */}

          {/* Public routes (no login required) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard page (protected route) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute> {/* Checks if user is authenticated */}
                <Layout> {/* Wrap page with common UI layout */}
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Transaction list page */}
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Layout>
                  <TransactionList />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Add transaction page */}
          <Route
            path="/add-transaction"
            element={
              <PrivateRoute>
                <Layout>
                  <AddTransaction />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Wallets list page */}
          <Route
            path="/wallets"
            element={
              <PrivateRoute>
                <Layout>
                  <Wallets />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Wallet detail page — phải đặt TRƯỚC wildcard * */}
          <Route
            path="/wallets/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <WalletDetail />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown route to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
