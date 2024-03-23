import Link from "next/link";
import Logo from "./logo";

const Navbar: React.FC = () => {
  return (
    <div className="h-20 w-full bg-background2">
      <div className="container mx-auto flex h-full items-center gap-8">
        <Link className="h-full" href="/">
          <Logo />
        </Link>
        <span className="text-3xl font-bold text-white">
          Planning Poker Tool
        </span>
      </div>
    </div>
  );
};

export default Navbar;
