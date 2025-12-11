import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import PrivateRoute from './components/PrivateRoute';
import WelcomeScreen from './pages/WelcomeScreen';
import ProfileSetup from './pages/ProfileSetup';
import GameScreen from './pages/GameScreen';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <GameProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/profile-setup" element={
                <PrivateRoute>
                  <ProfileSetup />
                </PrivateRoute>
              } />
              <Route path="/game" element={
                <PrivateRoute>
                  <GameScreen />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
