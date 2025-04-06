import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component to protect routes based on authentication status and user role.
 *
 * @param {object} props - The component props.
 * @param {string} [props.requiredRole] - The role required to access the route (e.g., 'admin'). If not provided, only checks for login status.
 * @param {React.ReactNode} [props.children] - Alternative way to pass the component to render if using wrapper style.
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1. Check if user is logged in (token exists)
  if (!token) {
    // Not logged in, redirect to login page
    // Pass the intended destination via state so login page can redirect back after success
    return <Navigate to="/login" replace />;
  }

  // 2. Check if a specific role is required and if the user has it
  if (requiredRole && userRole !== requiredRole) {
    // Logged in, but does not have the required role
    // Redirect to a 'Forbidden' page or home page (e.g., '/menu')
    // For simplicity, redirecting to the main menu page for now.
    console.warn(`Access denied: Route requires role '${requiredRole}', user has role '${userRole}'. Redirecting...`);
    return <Navigate to="/menu" replace />;
  }

  // 3. User is logged in and has the required role (or no specific role was required)
  // Render the child component passed via props or the nested route via <Outlet />
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
