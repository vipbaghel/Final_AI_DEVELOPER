import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        axios.post('/users/register', { email, password })
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                navigate('/home')
            }).catch((err) => {
                console.log(err.response.data)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
                <div className="flex flex-col items-center mb-6">
                    <span className="relative flex items-center mb-2">
                        <svg className="w-12 h-12 text-purple-400 drop-shadow-glow animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polygon points="12,3 14.9,9 22,9.3 16.5,13.7 18.6,20.5 12,16.8 5.4,20.5 7.5,13.7 2,9.3 9.1,9" stroke="currentColor" stroke-width="2" fill="#a78bfa" />
                            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
                        </svg>
                        <span className="absolute inset-0 rounded-full blur-lg opacity-40 bg-purple-400 animate-glow"></span>
                    </span>
                    <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide">Register</h2>
                    <p className="text-base text-gray-200 font-light text-center mb-2">
                        Create your account and start building with AI!
                    </p>
                </div>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-200 mb-2 font-medium" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 transition"
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-200 mb-2 font-medium" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 transition"
                            placeholder="Enter your password"
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 hover:shadow-lg transition"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-300 mt-6 text-center">
                    Already have an account? <Link to="/login" className="text-purple-400 hover:underline font-semibold">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register