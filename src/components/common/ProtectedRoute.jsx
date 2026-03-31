import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

export default function ProtectedRoute({ ownerOnly = false }) {
  const { user, isOwner } = useAuth();
  const [authOpen, setAuthOpen] = useState(true);

  if (!user) {
    return (
      <>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        {!authOpen && <Navigate to="/" replace />}
      </>
    );
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
