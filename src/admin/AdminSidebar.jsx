import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-6">
      <h2 className="text-xl font-semibold mb-8">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/admin" className="text-lg">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/addabout" className="text-lg">
            About
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/projects" className="text-lg">
            Projects
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/experi" className="text-lg">
            Experiences
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/contact" className="text-lg">
            Contact
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/experi" className="text-lg">
            Testimonials
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/techadmin" className="text-lg">
            Techs
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
