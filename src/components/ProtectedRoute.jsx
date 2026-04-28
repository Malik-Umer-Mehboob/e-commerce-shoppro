import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const getDashboardByRole = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    if (role === 'support') return '/support/dashboard';
    if (role === 'rider') return '/rider/dashboard';
    return '/home';
};

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, role } = useSelector(state => state.auth);

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role → go to own dashboard
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to={getDashboardByRole(role)} replace />;
    }

    return children;
}
