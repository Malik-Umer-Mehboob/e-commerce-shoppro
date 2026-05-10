import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const { isAuthenticated, user } = useSelector(
        state => state.auth
    );

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role → redirect to own dashboard
    if (allowedRoles.length > 0) {
        const userRole = user?.role
            ?? user?.roles?.[0]?.name
            ?? user?.roles?.[0];

        if (!allowedRoles.includes(userRole)) {
            // Redirect to correct dashboard
            const dashboards = {
                admin: '/admin/dashboard',
                seller: '/seller/dashboard',
                support: '/support/dashboard',
                rider: '/rider/dashboard',
                customer: '/home',
            };
            return <Navigate
                to={dashboards[userRole] ?? '/home'}
                replace
            />;
        }
    }

    return children;
}
