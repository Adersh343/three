import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';

const   UserLayout = ({children}) => {
  return (
    <div className="layout">
     <Navbar/>
      <div className="content">
        {children}
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default UserLayout;
