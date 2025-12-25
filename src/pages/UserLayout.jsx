import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';

const   UserLayout = ({children}) => {
  return (
    <div className="relative w-full overflow-hidden">
     <Navbar/>
      <main className="relative z-0">
        {children}
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default UserLayout;
