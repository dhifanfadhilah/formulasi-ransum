import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormulasiPage from './pages/FormulasiPage';
import HasilFormulasiPage from './pages/HasilFormulasiPage';
import LoginPage from './pages/LoginPage';
import DaftarPage from './pages/DaftarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formulasi" element={<FormulasiPage />} />
        <Route path="/hasil-formulasi" element={<HasilFormulasiPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<DaftarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
