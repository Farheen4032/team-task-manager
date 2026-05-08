import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()

    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    try {

      setLoading(true)

      console.log('Login Button Clicked')

      const res = await API.post('/auth/login', {
        email,
        password
      })

      console.log('LOGIN RESPONSE:', res.data)

      localStorage.setItem('token', res.data.token)

      localStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      )

      alert('Login Successful ✅')

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert(
        error?.response?.data?.message ||
        'Invalid Email or Password'
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
      padding: '20px'
    }}>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>

        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#111827',
          fontSize: '38px'
        }}>
          🚀 Task Manager
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '30px',
          fontSize: '15px'
        }}>
          Login to continue
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '18px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '22px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div style={{
          marginTop: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <Link
            to="/register"
            style={{
              textDecoration: 'none',
              color: '#4f46e5',
              fontWeight: '600'
            }}
          >
            Register
          </Link>

          <Link
            to="/forgot-password"
            style={{
              textDecoration: 'none',
              color: '#4f46e5',
              fontWeight: '600'
            }}
          >
            Forgot Password?
          </Link>

        </div>

      </div>

    </div>

  )

}

export default Login