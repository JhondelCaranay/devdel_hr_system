import { Link } from "@tanstack/react-router";
import NavLink from "./navbar-link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          DevDel
        </Link>
        <nav className="flex items-center gap-6 font-medium text-gray-700">
          <NavLink to="/" label="Home" />
          <NavLink to="/jobs" label="Jobs" />
          <NavLink to="/services" label="Services" />
          <NavLink to="/about" label="About" />
          <Link to="/login">
            <Button variant="outline" className="rounded-xl">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
