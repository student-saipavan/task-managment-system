# Full-Stack Task Management System

A complete MERN stack application for managing tasks with authentication, filtering, search, pagination, and analytics.

## Features
- **JWT Authentication:** Secure login and registration.
- **CRUD Operations:** Create, read, update, delete tasks.
- **Filtering & Search:** Filter by priority, status, and search by title.
- **Sorting & Pagination:** Organize tasks effectively.
- **Analytics Dashboard:** Visualize task data with Recharts.
- **Responsive Design:** Works on all devices.
- **Dark Mode:** Save preferences in localStorage.

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios, Recharts, Tailwind CSS, lucide-react.
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Project Structure
\`\`\`text
task-management-system/
├── client/          # Frontend React App
├── server/          # Backend Express API
├── .gitignore
└── README.md
\`\`\`

## Setup Instructions

### 1. Clone & Install
\`\`\`bash
git clone <repository-url>
cd task-management-system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
\`\`\`

### 2. Environment Variables
Create `.env` files in both `server/` and `client/` directories based on the provided `.env.example` files.
- You must have MongoDB running locally at `mongodb://127.0.0.1:27017` or use a MongoDB Atlas URI in `server/.env`.

### 3. Run the App
**Backend:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd client
npm run dev
\`\`\`

## API Endpoints
### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected, accepts search, status, priority, page, limit, sort query params)
- `POST /api/tasks` - Create a task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Change task status

### Analytics
- `GET /api/tasks/analytics/summary` - Get task statistics

## Design Decisions
- **JWT authentication:** Chosen for stateless, secure API communication.
- **Separate frontend/backend:** Allows independent scaling and better separation of concerns.
- **User-specific task ownership:** Ensures data privacy across different users.
- **MongoDB indexes:** Created on frequently queried fields like `user`, `status`, `priority` to ensure performant filtering.
- **Backend pagination:** Reduces payload size for large lists.
- **React Context:** Used for simple, globally accessible state management for User and Theme.
- **Tailwind CSS:** Enables rapid, responsive UI development without maintaining large CSS files.

## Future Enhancements
- Team collaboration (shared tasks)
- Notifications (email/push)
- Drag-and-drop Kanban board
- File attachments
- Role-based access control
