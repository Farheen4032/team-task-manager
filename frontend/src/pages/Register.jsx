import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('member')

  const handleRegister = async (e) => {

    e.preventDefault()

    try {

      await API.post('/auth/register', {
        name,
        email,
        password,
        role
      })

      alert('Registration Successful ✅')

      navigate('/')

    } catch (error) {

      console.log(error)

      alert(
        error.response?.data?.message ||
        'Registration Failed'
      )

    }

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
          🚀 Task Manager
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Create your account
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none'
            }}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none'
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
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none'
            }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none'
            }}
          >

            <option value="member">
              Member
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

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
            Register
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
            Already have an account? Login
          </Link>

        </div>

      </div>

    </div>

  )

}

export default Register