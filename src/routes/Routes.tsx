import { Outlet, RouteObject, useRoutes } from 'react-router-dom';

import Invoice from '@/pages/Invoice';
import CreateInvoice from '@/pages/CreateInvoice';
import InvoiceDetail from '@/pages/InvoiceDetail';
import routeStrings from '@/routes/routeStrings';
import DashboardLayout from '../components/layouts/DashboardLayout';
import PermissionDenied from '@/pages/PermissionDenied';

const routes: RouteObject[] = [
  {
    path: '',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            path: routeStrings.invoices,
            element: <Invoice />,
          },
          {
            path: routeStrings.invoiceDetail,
            element: <InvoiceDetail />,
          },
          {
            path: routeStrings.invoiceCreate,
            element: <CreateInvoice />,
          },
        ],
      },
      {
        path: '*',
        element: <PermissionDenied />,
      },
    ],
  },
];

const Routes = () => {
  const element = useRoutes(routes);
  return <>{element}</>;
};

export default Routes;
