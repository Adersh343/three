import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-primary text-white font-sans">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto bg-black-100/50 backdrop-blur-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
