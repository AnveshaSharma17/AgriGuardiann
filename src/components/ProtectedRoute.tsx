import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    if (!token || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
