import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormulasiPage from './pages/FormulasiPage';
import HasilFormulasiPage from './pages/HasilFormulasiPage';
import LoginPage from './pages/LoginPage';
import DaftarPage from './pages/DaftarPage';
import LupaPassword from './pages/LupaPassword';
import InformasiNutrisi from './pages/InformasiNutrisi';
import Dashboard from './pages/Dashboard';
import RiwayatFormulasi from './pages/RiwayatFormulasi';
import DetailFormulasi from './pages/DetailFormulasi';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import BahanPakanAdmin from './pages/admin/BahanPakanAdmin';
import PenggunaAdmin from './pages/admin/PenggunaAdmin';
import KebutuhanNutrisiAdmin from './pages/admin/KebutuhanNutrisiAdmin';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formulasi" element={<FormulasiPage />} />
        <Route path="/hasil-formulasi" element={<HasilFormulasiPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<DaftarPage />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/informasi-nutrisi" element={<InformasiNutrisi />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/riwayat-formulasi" element={<RiwayatFormulasi />} />
        <Route path="/detail-formulasi" element={<DetailFormulasi />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/bahan-pakan" element={<BahanPakanAdmin />} />
        <Route path="/admin/pengguna" element={<PenggunaAdmin />} />
        <Route path="/admin/kebutuhan-nutrisi" element={<KebutuhanNutrisiAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
