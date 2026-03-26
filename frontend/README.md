# Emergency Response Platform - Frontend

A modern React TypeScript frontend for the Emergency Response Platform, providing incident management, user administration, and real-time emergency response coordination.

## Features

- **Authentication & Authorization**: Secure login/logout with JWT tokens and role-based access control
- **Dashboard**: Overview of incidents, statistics, and quick actions
- **Incident Management**: Create, view, update, and track emergency incidents
- **User Management**: Admin interface for managing users, roles, and permissions
- **Responsive Design**: Mobile-friendly interface for emergency responders

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **CSS Modules** for styling
- **JWT** for authentication

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Login.css
│   │   │   └── PrivateRoute.tsx
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.css
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.css
│   │   ├── incidents/
│   │   │   ├── IncidentList.tsx
│   │   │   ├── IncidentList.css
│   │   │   ├── IncidentDetail.tsx
│   │   │   └── IncidentDetail.css
│   │   └── users/
│   │       ├── UserManagement.tsx
│   │       └── UserManagement.css
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── incidentService.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## API Integration

The frontend communicates with the backend through REST APIs:

- **Authentication**: `/auth/*` endpoints
- **Users**: `/users/*` endpoints
- **Incidents**: `/incidents/*` endpoints (when implemented)

All API calls include JWT authentication headers automatically.

## User Roles

- **SUPER_ADMIN**: Full access to all features including user management
- **ADMIN**: Administrative access with limited user management
- **RESPONDER**: Can manage incidents and view assigned tasks
- **VIEWER**: Read-only access to incident information

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices and hooks
- Use CSS modules for component styling
- Keep components small and focused on single responsibilities

### State Management

- Use React hooks (useState, useEffect) for local state
- Consider Context API for global state if needed
- Avoid prop drilling with proper component composition

### Error Handling

- Display user-friendly error messages
- Handle API errors gracefully
- Implement loading states for better UX

## Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Serve the `build` folder with a static server

3. Configure the backend API URL in production environment

## Contributing

1. Follow the existing code style and structure
2. Write clear commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the Emergency Response Platform and follows the same licensing terms.