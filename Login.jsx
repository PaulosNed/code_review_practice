import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import getApiKey from '../apiKeys'

function Login() {
    const endpoint = getApiKey()
  const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        console.log(formData)
        try {
            const response = await axios.post(`${endpoint}/api/login`, formData)
            localStorage.setItem('token', response.data.token)
            const decoded = jwt_decode(localStorage.getItem('token'))
            toast.success("Logged In succefully")
            console.log(decoded)
            if (decoded.role === 'Student'){
                navigate('/student')
            } else if (decoded.role === 'Admin') {
                navigate('/admin')
            } else {
                navigate('/teacher')
            }
            
        } catch (error) {
            console.group(error)
            toast.error(error.response.data.message)
        }
        
        setLoading(false)
    }

  return loading ? <Loader /> : (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-red-500 uppercase">
                Sign in
            </h1>
            <form className="mt-6">
                <div className="mb-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-800"
                    >
                        Email
                    </label>
                    <input
                        onChange={handleChange}
                        id='email'
                        type="email"
                        className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-red-400 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-800"
                    >
                        Password
                    </label>
                    <input
                        onChange={handleChange}
                        id='password'
                        type="password"
                        className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-red-400 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>
                <Link
                    to="/"
                    className="text-xs text-red-500 hover:underline"
                >
                    Forgot Password?
                </Link>
                <div className="mt-6">
                    <button 
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 tracking-wide text-white bg-gradient-to-r from-red-500 to-yellow-500 rounded-md transform transition-all hover:scale-105 duration-500 focus:outline-none"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login