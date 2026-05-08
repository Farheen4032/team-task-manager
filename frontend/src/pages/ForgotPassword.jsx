import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const handleReset = (e) => {

    e.preventDefault()

    if (!email) {

      alert('Please enter email')
      return

    }

    alert(`Reset link sent to ${email} ✅`)

    navigate('/')

  }

  return (

    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
    }}>

      <div style={{
        width: '380px',
        background: 'white',
        padding: '35px',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }}>

        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#111827'
        }}>
          🔒 Forgot Password
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Enter your email to reset password
        </p>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Send Reset Link
          </button>

        </form>

        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>

          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#4f46e5',
              fontWeight: '600'
            }}
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>

  )

}

export default ForgotPassword