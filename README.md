# Go Chat App

A real-time chat application built with Go backend and React frontend, featuring WebSocket connections for instant messaging.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **User Authentication**: Secure login/registration with JWT tokens
- **User Search**: Find and connect with other users
- **Private Chat**: One-on-one messaging between users
- **Responsive Design**: Modern UI that works on desktop and mobile
- **Message History**: Persistent message storage and retrieval

## 🏗️ Architecture

### Backend (Go)

- **Framework**: Gorilla Mux for HTTP routing
- **WebSocket**: Gorilla WebSocket for real-time communication
- **Database**: PostgreSQL for data persistence
- **Authentication**: JWT tokens with secure cookies
- **Architecture**: Clean separation with handlers, services, and middleware

### Frontend (React)

- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI) for components
- **State Management**: Zustand for global state
- **Build Tool**: Vite for fast development and building
- **Styling**: MUI's sx prop for component styling

## 📁 Project Structure

```
go-chat-app/
├── backend/
│   ├── pkg/
│   │   ├── handlers/          # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Authentication & CORS
│   │   ├── websocket/         # WebSocket connection management
│   │   ├── db/               # Database models and connection
│   │   ├── utils/            # JWT, HTTP helpers, errors
│   │   ├── validation/       # Input validation
│   │   └── config/           # Environment configuration
│   ├── migrations/           # Database migrations
│   └── main.go              # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Auth/        # Login/Register components
│   │   │   ├── Chat/        # Chat interface components
│   │   │   └── Search/      # User search components
│   │   ├── api/             # API calls and WebSocket
│   │   ├── stores/          # Zustand state management
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites

- Go 1.23+
- Node.js 18+
- PostgreSQL 12+
- Yarn or npm

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd go-chat-app
   ```

2. **Set up environment variables**
   Create a `.env` file in the `backend/` directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=chatappuser
   DB_PASSWORD=your_password
   DB_NAME=chatappdb
   DB_SSLMODE=disable

   # JWT Configuration
   JWT_SECRET=your_very_secure_jwt_secret_key_here
   JWT_EXPIRY_HOURS=24

   # CORS Configuration
   CORS_ALLOWED_ORIGIN=http://localhost:5173
   CORS_ALLOWED_METHODS=POST,GET,OPTIONS,PUT,DELETE
   CORS_ALLOWED_HEADERS=Content-Type,Authorization

   # Server Configuration
   HTTP_PORT=8080
   WEBSOCKET_PORT=8081
   ENV=development
   ```

3. **Set up PostgreSQL database**

   ```bash
   # Create database
   createdb chatappdb

   # Run migrations
   cd backend
   psql -d chatappdb -f migrations/000001_create_users_table.up.sql
   ```

4. **Install dependencies and run**
   ```bash
   cd backend
   go mod tidy
   go run main.go
   ```

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   yarn install
   ```

2. **Start development server**

   ```bash
   yarn dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - WebSocket: ws://localhost:8081

## 🔧 Configuration

### Environment Variables

| Variable              | Description           | Default               |
| --------------------- | --------------------- | --------------------- |
| `DB_HOST`             | Database host         | localhost             |
| `DB_PORT`             | Database port         | 5432                  |
| `DB_USER`             | Database username     | chatappuser           |
| `DB_PASSWORD`         | Database password     | -                     |
| `DB_NAME`             | Database name         | chatappdb             |
| `JWT_SECRET`          | JWT signing secret    | -                     |
| `JWT_EXPIRY_HOURS`    | Token expiry in hours | 24                    |
| `CORS_ALLOWED_ORIGIN` | Allowed CORS origin   | http://localhost:5173 |
| `HTTP_PORT`           | HTTP server port      | 8080                  |
| `WEBSOCKET_PORT`      | WebSocket server port | 8081                  |

## 🚀 Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Search Users**: Use the search bar to find other users
3. **Start Chatting**: Click on a user to start a conversation
4. **Real-time Messaging**: Send and receive messages instantly
5. **Message History**: Previous messages are automatically loaded

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **WebSocket Origin Validation**: Secure WebSocket connections

## 🧪 API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/validateCookie` - Validate authentication

### Messaging

- `GET /api/hydrateMessages?recipient_id={id}` - Get message history
- `GET /api/searchUsers?username={query}` - Search for users

### WebSocket

- `ws://localhost:8081/ws` - WebSocket connection for real-time messaging

## 🛠️ Development

### Backend Development

```bash
cd backend
go run main.go
```

### Frontend Development

```bash
cd frontend
yarn dev
```

### Building for Production

```bash
# Backend
cd backend
go build -o chat-app .

# Frontend
cd frontend
yarn build
```

## 📝 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

> **Personal Project**: This application was developed as a personal learning project to explore real-time communication, modern web development practices, and full-stack architecture.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **WebSocket Connection Failed**

   - Check if backend is running on port 8081
   - Verify CORS settings
   - Check browser console for errors

3. **Frontend Build Errors**
   - Run `yarn install` to ensure dependencies are installed
   - Check Node.js version compatibility
   - Clear node_modules and reinstall if needed

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed error information
- Include logs and environment details

## 🎯 Future Enhancements

- [ ] Recent chats with notification badges
- [ ] Group messaging
- [ ] File sharing
- [ ] Message reactions
- [ ] Online status indicators
- [ ] Message search
- [ ] Push notifications
- [ ] Mobile app
- [ ] Message encryption
