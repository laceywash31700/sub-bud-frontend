import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }: RequireAuthProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}