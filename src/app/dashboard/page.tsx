import PrivateRoute from '../../../components/PrivateRoute';
import Dashboard from '../../../components/Dashboard';

export default function DashboardPage() {
  // This should be replaced with your actual authentication logic
  const isAuthenticated = true;

  return (
    <PrivateRoute isAuthenticated={isAuthenticated}>
      <Dashboard />
    </PrivateRoute>
  );
}