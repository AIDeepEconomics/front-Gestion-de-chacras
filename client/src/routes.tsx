import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import CompanySettings from '@/pages/CompanySettings';
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
    path: '/empresa',
    element: <CompanySettings />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
