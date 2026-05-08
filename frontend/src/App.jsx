import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path='/'
          element={<Navigate to="/login" />}
        />

        <Route
          path='/login'
          element={<Login />}
        />

        {/* REGISTER PAGE */}
        <Route
          path='/register'
          element={<Register />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path='/forgot-password'
          element={<ForgotPassword />}
        />

        {/* DASHBOARD */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App