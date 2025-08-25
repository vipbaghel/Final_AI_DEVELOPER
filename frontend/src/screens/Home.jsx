import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        axios.post('/projects/create', { name: projectName })
            .then((res) => {
                setIsModalOpen(false)
                setProjectName("")
                axios.get('/projects/all').then((res) => {
                    setProject(res.data.projects)
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 animate-gradient-move"></div>
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <div className="max-w-5xl w-full px-4 py-10">
                <header className="flex items-center gap-4 mb-8 justify-center">
                    <span className="relative flex items-center">
                        <svg className="w-14 h-14 text-purple-400 drop-shadow-glow animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <polygon points="12,3 14.9,9 22,9.3 16.5,13.7 18.6,20.5 12,16.8 5.4,20.5 7.5,13.7 2,9.3 9.1,9" stroke="currentColor" stroke-width="2" fill="#a78bfa" />
                            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
                        </svg>
                        <span className="absolute inset-0 rounded-full blur-lg opacity-40 bg-purple-400 animate-glow"></span>
                    </span>
                    <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">Your AI Projects</h1>
                </header>
                <div className="projects flex flex-wrap gap-6 justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="project flex flex-col items-center justify-center gap-2 p-6 border-2 border-purple-400 rounded-xl bg-white/10 text-white font-semibold shadow-lg hover:bg-purple-700/30 hover:scale-105 transition min-w-56"
                    >
                        <span className="text-2xl">+</span>
                        <span>New Project</span>
                    </button>
                    {project.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => {
                                navigate(`/project`, { state: { project } })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-6 border-2 border-blue-400 rounded-xl bg-white/10 text-white min-w-56 shadow-lg hover:bg-blue-700/30 hover:scale-105 transition"
                        >
                            <h2 className="font-bold text-lg">{project.name}</h2>
                            <div className="flex gap-2 items-center">
                                <p>
                                    <small>
                                        <i className="ri-user-line"></i> Collaborators:
                                    </small>
                                </p>
                                <span className="font-bold text-purple-300">{project.users.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-300">
                        <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="mt-1 block w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-5 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400 transition"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow hover:scale-105 transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home