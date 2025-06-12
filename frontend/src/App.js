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
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

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
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/riwayat-formulasi" element={
          <ProtectedRoute><RiwayatFormulasi /></ProtectedRoute>
        } />
        <Route path="/detail-formulasi/:id" element={
          <ProtectedRoute><DetailFormulasi /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute><DashboardAdmin /></AdminRoute>
        } />
        <Route path="/admin/bahan-pakan" element={
          <AdminRoute><BahanPakanAdmin /></AdminRoute>
        } />
        <Route path="/admin/pengguna" element={
          <AdminRoute><PenggunaAdmin /></AdminRoute>
        } />
        <Route path="/admin/kebutuhan-nutrisi" element={
          <AdminRoute><KebutuhanNutrisiAdmin /></AdminRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
