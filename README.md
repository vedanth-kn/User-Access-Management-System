# User Access Management System

A full-stack web application for managing user access requests to software applications within an organization. The system supports role-based access control with Admin, Manager, and Employee roles.

## 🚀 Features

- **Role-Based Authentication System**
  - Admin: Full system control, user management, software management
  - Manager: Approve/reject access requests, view team requests
  - Employee: Submit access requests, view personal request status

- **Software Management**
  - Add, edit, and delete software applications
  - Categorize software by type and access levels

- **Request Management**
  - Submit software access requests with justification
  - Approval workflow with manager review
  - Request status tracking and history

- **Secure Authentication**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes and middleware

## 🛠️ Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** - Web framework
- **TypeORM** - Database ORM
- **PostgreSQL/MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React.js** - Frontend framework
- **Context API** - State management
- **CSS3** - Styling
- **Axios** - HTTP client

## 📁 Project Structure

```
user_access_management/
├── user_access_server/          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── data-source.ts   # Database configuration
│   │   ├── entity/
│   │   │   ├── User.ts          # User entity
│   │   │   ├── Software.ts      # Software entity
│   │   │   └── Request.ts       # Request entity
│   │   ├── middleware/
│   │   │   └── auth.ts          # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── software.ts      # Software management routes
│   │   │   └── request.ts       # Request management routes
│   │   ├── utils/
│   │   │   └── auth.ts          # Auth utilities
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   └── .env.example
│
└── user_access_app/             # Frontend React App
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── dashboard/
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── ManagerDashboard.js
    │   │   │   └── EmployeeDashboard.js
    │   │   ├── requests/
    │   │   │   ├── RequestForm.js
    │   │   │   └── RequestList.js
    │   │   └── software/
    │   │       ├── SoftwareForm.js
    │   │       └── SoftwareList.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── RouterContext.js
    │   ├── styles/
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL or MySQL database

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd user_access_server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
  ```env
  # Database
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=your_username
  DB_PASSWORD=your_password
  DB_DATABASE=user_access_db
  ```

4. **Database Setup:**
   - Create a new database in PostgreSQL/MySQL
   - Update database credentials in `.env` file
   - The application will automatically create tables on first run

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd user_access_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend application:**
   ```bash
   npm start
   ```
   The frontend application will start on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=user_access_db
```

## 🚀 Usage

### Default Admin Account
After running the application for the first time, you can create an admin account through the signup process or seed the database with a default admin user.

### User Roles & Permissions

1. **Admin**
   - Manage all users
   - Add/edit/delete software applications
   - View all access requests
   - System-wide permissions

2. **Manager**
   - Approve/reject access requests
   - View team member requests
   - Limited software viewing permissions

3. **Employee**
   - Submit software access requests
   - View personal request history
   - Update profile information

### Workflow
1. **Employee** submits a software access request
2. **Manager** reviews and approves/rejects the request
3. **Admin** can override any decision and manage the entire system

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Software Management
- `GET /api/software` - Get all software
- `POST /api/software` - Create new software (Admin only)
- `PUT /api/software/:id` - Update software (Admin only)
- `DELETE /api/software/:id` - Delete software (Admin only)

### Request Management
- `GET /api/requests` - Get requests (filtered by role)
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request status
- `GET /api/requests/:id` - Get specific request

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Protected API routes
- Input validation and sanitization

## 🧪 Testing

To run tests (if implemented):
```bash
# Backend tests
cd user_access_server
npm test

# Frontend tests
cd user_access_app
npm test
```

## 📝 Development Notes

- The backend uses TypeScript for better type safety
- Frontend uses React Context for state management
- Database entities are defined using TypeORM decorators
- All API calls are centralized in the `utils/api.js` file
- Responsive design implemented with CSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created as part of the Leucine assignment submission.

## 📞 Support

If you encounter any issues during setup or have questions about the implementation, please refer to the code comments or create an issue in the repository.

---

**Note:** This project was developed as part of the Leucine recruitment process. Please ensure all dependencies are properly installed and environment variables are correctly configured before running the application.
