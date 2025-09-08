import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/Dashboard";
import UserStocks from "./pages/user/Stocks";
import UserPayments from "./pages/user/Payments";
import UserWithdraw from "./pages/user/Withdraw";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStocks from "./pages/admin/Stocks";
import AdminUsers from "./pages/admin/Users";
import AdminPayments from "./pages/admin/Payments";
import AdminWithdrawals from "./pages/admin/Withdrawals";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<UserDashboard />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/stocks" element={<UserStocks />} />
                      <Route path="/payments" element={<UserPayments />} />
                      <Route path="/withdraw" element={<UserWithdraw />} />

                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/stocks"
                        element={
                          <AdminRoute>
                            <AdminStocks />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <AdminRoute>
                            <AdminUsers />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/payments"
                        element={
                          <AdminRoute>
                            <AdminPayments />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/withdrawals"
                        element={
                          <AdminRoute>
                            <AdminWithdrawals />
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
