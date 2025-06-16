import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import HomePage from './pages/HomePage';
import FormulasiPage from './pages/FormulasiPage';
import HasilFormulasiPage from './pages/HasilFormulasiPage';
import InformasiNutrisi from './pages/InformasiNutrisi';
import LoginPage from './pages/LoginPage';
import DaftarPage from './pages/DaftarPage';
import LupaPassword from './pages/LupaPassword';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// user Pages
import Dashboard from './pages/Dashboard';
import RiwayatFormulasi from './pages/RiwayatFormulasi';
import DetailFormulasi from './pages/DetailFormulasi';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import BahanPakanAdmin from './pages/admin/BahanPakanAdmin';
import PenggunaAdmin from './pages/admin/PenggunaAdmin';
import KebutuhanNutrisiAdmin from './pages/admin/KebutuhanNutrisiAdmin';

function App() {
  return (
    <Router>
      <ToastContainer position='top-right' autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formulasi" element={<FormulasiPage />} />
        <Route path="/hasil-formulasi" element={<HasilFormulasiPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<DaftarPage />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/informasi-nutrisi" element={<InformasiNutrisi />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/riwayat-formulasi" element={<RiwayatFormulasi />} />
          <Route path="/detail-formulasi/:id" element={<DetailFormulasi />} />
        </Route>
        
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/bahan-pakan" element={<BahanPakanAdmin />} />
          <Route path="/admin/pengguna" element={<PenggunaAdmin />} />
          <Route path="/admin/kebutuhan-nutrisi" element={<KebutuhanNutrisiAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
