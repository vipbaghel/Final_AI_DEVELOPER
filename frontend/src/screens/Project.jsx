import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket' 
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)
    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])
    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation()
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    }

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setIsModalOpen(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const send = () => {
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }])
        setMessage("")
    }

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message)
        return (
            <div className='overflow-auto bg-gray-900 text-white rounded-sm p-2'>
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {
        initializeSocket(project._id)
        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
            })
        }
        receiveMessage('project-message', data => {
            if (data.sender._id == 'ai') {
                const message = JSON.parse(data.message)
                webContainer?.mount(message.fileTree)
                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data])
            } else {
                setMessages(prevMessages => [...prevMessages, data])
            }
        })
        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })
        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
        }).catch(err => {
            console.log(err)
        })
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className="relative h-screen w-screen flex overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-950 via-purple-950 to-gray-900 animate-gradient-move"></div>
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-800 opacity-20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            {/* Left Panel: Chat & Collaborators */}
            <section className="left relative flex flex-col h-screen min-w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-800 shadow-xl">
                <header className="flex justify-between items-center p-4 w-full bg-gray-800/80 rounded-t-2xl shadow z-10">
                    <button className="flex gap-2 items-center text-purple-400 font-semibold hover:scale-105 transition" onClick={() => setIsModalOpen(true)}>
                        <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#a78bfa" />
                            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                        </svg>
                        <span>Add collaborator</span>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 text-purple-400 hover:text-purple-600 transition">
                        <i className="ri-group-fill text-xl"></i>
                    </button>
                </header>
                <div className="conversation-area pt-16 pb-10 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`
                                ${msg.sender._id === 'ai' ? 'max-w-96 bg-gradient-to-r from-purple-900/80 to-blue-900/80 text-white' : 'max-w-64 bg-gray-800/60 text-gray-100'}
                                ${msg.sender._id == user._id.toString() && 'ml-auto'}
                                message flex flex-col p-3 rounded-xl shadow
                            `}>
                                <small className="opacity-65 text-xs mb-1">{msg.sender.email}</small>
                                <div className="text-sm">
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="inputField w-full flex absolute bottom-0 left-0 px-2 py-3 bg-gray-800/80 rounded-b-2xl">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="p-3 rounded-l-xl bg-gray-900 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            type="text"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={send}
                            className="px-5 rounded-r-xl bg-gradient-to-r from-blue-700 to-purple-700 text-white font-bold hover:scale-105 transition"
                        >
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>
                {/* Collaborators Side Panel */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-gray-900/95 backdrop-blur-lg absolute transition-all duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 z-20 rounded-r-2xl shadow-xl`}>
                    <header className="flex justify-between items-center px-4 p-2 bg-purple-900/80 rounded-t-2xl">
                        <h1 className="font-semibold text-lg text-purple-300">Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 text-purple-400 hover:text-purple-600 transition">
                            <i className="ri-close-fill text-xl"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-2 px-4 py-2">
                        {project.users && project.users.map(user => (
                            <div key={user._id} className="user cursor-pointer hover:bg-purple-900/60 p-2 flex gap-2 items-center rounded-xl transition">
                                <div className="aspect-square rounded-full w-10 h-10 flex items-center justify-center text-white bg-purple-700 shadow">
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className="font-semibold text-lg text-purple-200">{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Right Panel: Explorer & Editor */}
            <section className="right flex-grow h-full flex bg-gradient-to-br from-gray-900/80 via-blue-950/10 to-purple-950/10">
                {/* File Explorer */}
                <div className="explorer h-full max-w-64 min-w-52 bg-gray-900/80 border-r border-gray-800 shadow-lg rounded-l-2xl">
                    <div className="file-tree w-full py-4 px-2">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file)
                                    setOpenFiles([...new Set([...openFiles, file])])
                                }}
                                className={`tree-element cursor-pointer p-3 flex items-center gap-2 rounded-xl w-full mb-2 font-semibold text-lg bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:bg-purple-900/60 transition ${currentFile === file ? 'ring-2 ring-purple-700' : ''}`}
                            >
                                <p>{file}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full shrink bg-gray-900/80 rounded-r-2xl shadow-lg">
                    <div className="top flex justify-between w-full px-4 py-2 bg-gray-800/80 rounded-t-2xl">
                        <div className="files flex gap-2">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer p-2 px-4 flex items-center gap-2 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:bg-purple-900/60 transition ${currentFile === file ? 'ring-2 ring-purple-700' : ''}`}
                                >
                                    <p>{file}</p>
                                </button>
                            ))}
                        </div>
                        <div className="actions flex gap-2">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)
                                    const installProcess = await webContainer.spawn("npm", ["install"])
                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) { console.log(chunk) }
                                    }))
                                    if (runProcess) { runProcess.kill() }
                                    let tempRunProcess = await webContainer.spawn("npm", ["start"])
                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) { console.log(chunk) }
                                    }))
                                    setRunProcess(tempRunProcess)
                                    webContainer.on('server-ready', (port, url) => {
                                        setIframeUrl(url)
                                    })
                                }}
                                className="p-2 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 text-white font-bold shadow hover:scale-105 transition"
                            >
                                Run
                            </button>
                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {fileTree[currentFile] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow bg-gray-950 rounded-b-2xl">
                                <pre className="hljs h-full">
                                    <code
                                        className="hljs h-full outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: {
                                                    file: {
                                                        contents: updatedContent
                                                    }
                                                }
                                            }
                                            setFileTree(ft)
                                            saveFileTree(ft)
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            paddingBottom: '25rem',
                                            counterSet: 'line-numbering',
                                            color: '#e0e0e0',
                                            background: 'transparent'
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Preview */}
                {iframeUrl && webContainer && (
                    <div className="flex min-w-96 flex-col h-full bg-gray-900/80 rounded-r-2xl shadow-lg">
                        <div className="address-bar px-2 py-2 bg-purple-900/80 rounded-t-2xl">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-2 px-4 rounded-lg bg-gray-800 text-purple-300 font-semibold"
                            />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full rounded-b-2xl border-0 bg-gray-950"></iframe>
                    </div>
                )}
            </section>

            {/* Modal for Adding Collaborators */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-700 relative">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-purple-300">Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-purple-400 hover:text-purple-600 transition">
                                <i className="ri-close-fill text-xl"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user._id}
                                    className={`user cursor-pointer hover:bg-purple-900/60 ${Array.from(selectedUserId).indexOf(user._id) !== -1 ? 'bg-purple-900/80' : ""} p-2 flex gap-2 items-center rounded-xl transition`}
                                    onClick={() => handleUserClick(user._id)}>
                                    <div className="aspect-square relative rounded-full w-10 h-10 flex items-center justify-center text-white bg-purple-700 shadow">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg text-purple-200">{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl font-bold shadow hover:scale-105 transition"
                        >
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project
