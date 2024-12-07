import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar /> {/* Sidebar on the left */}

      <div className="flex-1 p-4 overflow-y-auto">
        {/* The nested routes will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
