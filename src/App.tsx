/**
 * Main Application Component
 * Routing and provider setup
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LayoutPro } from './components/layout/LayoutPro';
import { LoginPage } from './pages/Login';
import { DashboardProPage } from './pages/DashboardPro';
import { EmployeeListPage } from './pages/employees/EmployeeList';
import { EmployeeFormPage } from './pages/employees/EmployeeForm';
import { ProfileProPage } from './pages/ProfilePro';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <LayoutPro />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardProPage />} />
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/create" element={<EmployeeFormPage />} />
              <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/profile" element={<ProfileProPage />} />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
