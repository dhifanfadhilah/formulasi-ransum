import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Spinner = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-green-600"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-green-600 delay-100"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-green-600 delay-200"></div>
    </div>
);

const VerifyEmailPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Memverifikasi email Anda...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${uid}/${token}/`);
        setStatus('success');
        setMessage(res.data.message || 'Email berhasil diverifikasi.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verifikasi gagal atau link tidak valid.');
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md text-center space-y-4">
        {status === 'loading' && (
          <>
            <Spinner />
            <p className="text-gray-700">{message}</p>
          </>
        )}
        {status === 'success' && (
          <p className="text-green-600 font-semibold">
            {message} <br /> Mengarahkan ke halaman login...
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
