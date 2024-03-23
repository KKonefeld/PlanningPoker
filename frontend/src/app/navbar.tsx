import Logo from "./logo";

const Navbar: React.FC = () => {
  return (
    <div className="w-full bg-background2 h-20">
      <div className="h-full container mx-auto flex items-center gap-8">
        <Logo />
        <span className="text-3xl font-bold text-white">
          Planning Poker Tool
        </span>
      </div>
    </div>
  );
};

export default Navbar;
