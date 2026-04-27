import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    axios.post("https://taskmanager-backend-0a21.onrender.com/login", { email, password })
      .then((result) => {
        console.log(result)

        if (result.data.message === "Success") {
          // ✅ store TOKEN (not userId)
          localStorage.setItem("token", result.data.token)

          navigate('/')
        } else {
          alert(result.data.message)
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <form 
        onSubmit={handleLogin} 
        className="flex flex-col gap-2 p-4 max-w-sm mx-auto mt-20 border rounded-md shadow"
      >
        <label>Email</label>
        <input 
          type="text" 
          placeholder="email" 
          className="border p-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input 
          type="password" 
          placeholder="password" 
          className="border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>

        <Link to="/signup" className="text-blue-500 text-sm">
          signup
        </Link>
      </form>
    </>
  )
}

export default Login