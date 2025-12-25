import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/admin", label: "Dashboard" },
        { path: "/admin/addabout", label: "About" },
        { path: "/admin/projects", label: "Projects" },
        { path: "/admin/experi", label: "Experiences" },
        { path: "/admin/techadmin", label: "Tech Stack" },
        { path: "/admin/contact", label: "Contact Messages" },
        { path: "/admin/testimonials", label: "Testimonials" },
    ];

  return (
    <div className="w-64 h-full p-6 border-r border-white/5 bg-glass-white backdrop-blur-md flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary animate-pulse"></div>
         <h2 className="text-xl font-bold tracking-wider text-white">ADMIN<span className="text-accent">PANEL</span></h2>
      </div>
      
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <li key={item.path}>
                <Link 
                    to={item.path} 
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActive 
                        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <span className="font-medium text-sm">{item.label}</span>
                </Link>
                </li>
            )
        })}
      </ul>

      <div className="mt-auto px-4 py-4 text-xs text-center text-gray-500 border-t border-white/5 pt-6">
        &copy; 2024 Byteedoc Admin
      </div>
    </div>
  );
};

export default Sidebar;
