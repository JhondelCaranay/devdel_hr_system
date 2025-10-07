import { Link, useRouterState } from "@tanstack/react-router";
import clsx from "clsx";

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const { location } = useRouterState();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        "transition-colors",
        isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
      )}
    >
      {label}
    </Link>
  );
};

export default NavLink;
