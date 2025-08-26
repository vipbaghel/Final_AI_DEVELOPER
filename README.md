# AI Developer Platform

A full-stack platform for managing AI projects and users, featuring authentication, project management, and AI service integration. Built with React (Vite) for the frontend and Node.js/Express for the backend.

## Features

- User authentication (register, login)
- Create and manage AI projects
- AI service integration
- Real-time communication (socket.io)
- RESTful API backend
- Responsive UI with Tailwind CSS

## Folder Structure

```
Ai_developer/
├── backend/                # Node.js/Express backend
│   ├── controllers/        # Route controllers (AI, project, user)
│   ├── db/                 # Database connection
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Service logic (AI, project, user, Redis)
│   ├── .env                # Environment variables
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── package.json
├── frontend/               # React (Vite) frontend
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── auth/           # Authentication components
│   │   ├── config/         # Axios, socket, web container config
│   │   ├── context/        # User context
│   │   ├── routes/         # App routes
│   │   ├── screens/        # Page components (Home, Login, Register, Project, Frontpage)
│   │   ├── App.jsx         # Main app component
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
├── .gitignore
└── temp.md
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/ai-developer-platform.git
    cd Ai_developer
    ```

2. Install backend dependencies:
    ```sh
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```sh
    cd ../frontend
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in `backend/` with your MongoDB URI and other secrets.
    - Create a `.env` file in `frontend/` for frontend environment variables if needed.

### Running the App

- **Start the backend:**
    ```sh
    cd backend
    npm start
    ```
    Backend runs on [http://localhost:5000](http://localhost:5000).

- **Start the frontend:**
    ```sh
    cd ../frontend
    npm run dev
    ```
    Frontend runs on [http://localhost:5173](http://localhost:5173).

## Technologies Used

- React (Vite)
- Node.js & Express
- MongoDB & Mongoose
- Tailwind CSS
- Socket.io
- JWT Authentication

## License

This project is licensed under the MIT License.

---

Feel free to contribute or open issues for
