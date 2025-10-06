import { Link } from "@tanstack/react-router";

const NavLink = ({ to, label }: { to: string; label: string }) => {
  return (
    <Link to={to} className="hover:text-blue-600 transition-colors">
      {label}
    </Link>
  );
};

export default NavLink;
