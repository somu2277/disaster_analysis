import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ThermalDetection from './pages/ThermalDetection';
import BuildingDamage from './pages/BuildingDamage';
import History from './pages/History';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/thermal-detection" element={<ThermalDetection />} />
          <Route path="/building-damage" element={<BuildingDamage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
