import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import UploadForm from './components/UploadForm';
import MatchHistory from './components/MatchHistory';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <MatchHistory />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
