import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/login');
    }
  }, [admin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;