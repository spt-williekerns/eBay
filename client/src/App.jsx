// Main App Component with Routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { HelpButton } from './components/HelpButton';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ItemDetail } from './pages/ItemDetail';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddItem } from './pages/admin/AddItem';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

// Protected route wrapper for admin pages
function AdminRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem('adminToken');

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-item"
          element={
            <AdminRoute>
              <AddItem />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Help Button (always visible) */}
      <HelpButton />
    </BrowserRouter>
  );
}
