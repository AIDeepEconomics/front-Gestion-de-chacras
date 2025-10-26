import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { LoginPage } from '@/components/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
