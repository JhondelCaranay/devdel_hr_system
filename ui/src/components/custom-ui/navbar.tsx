import { Link } from "@tanstack/react-router";
import NavLink from "./navbar-link";
import { Button } from "../ui/button";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xs border-b dark:border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-primary tracking-tight">
          DevDel
        </Link>
        <nav className="flex items-center gap-6 font-medium text-gray-700 dark:text-foreground transition-colors duration-300">
          <NavLink to="/" label="Home" />
          <NavLink to="/jobs" label="Jobs" />
          <NavLink to="/services" label="Services" />
          <NavLink to="/about" label="About" />
          <Link to="/login">
            <Button variant="outline" className="rounded-xl dark:border-border dark:text-foreground">
              Login
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
