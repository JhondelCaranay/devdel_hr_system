const NavbarFooter = () => {
  return (
    <footer className="bg-transparent border-t dark:border-border py-6 text-center text-sm text-gray-500 dark:text-muted-foreground transition-colors duration-300">
      © {new Date().getFullYear()} DevDel. Built with ❤️ by developers for developers.
    </footer>
  );
};

export default NavbarFooter;
