import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import IncidentList from './components/incidents/IncidentList';
import IncidentDetail from './components/incidents/IncidentDetail';
import UserManagement from './components/users/UserManagement';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/incidents" element={
              <PrivateRoute>
                <IncidentList />
              </PrivateRoute>
            } />
            <Route path="/incidents/:id" element={
              <PrivateRoute>
                <IncidentDetail />
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <UserManagement />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;