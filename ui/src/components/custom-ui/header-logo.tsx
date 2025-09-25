import { Link } from "@tanstack/react-router";

const HeaderLogo = () => {
  return (
    <Link to="/dashboard">
      <div className="items-center hidden lg:flex">
        {/* <Image src={"/logo.svg"} alt="logo" height={28} width={28} /> */}
        <p className="font-semibold text-white text-2xl ml-2.5">HR System</p>
      </div>
    </Link>
  );
};
export default HeaderLogo;
