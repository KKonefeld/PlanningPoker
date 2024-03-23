import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto flex flex-col items-center pt-24 text-white">
      <span className="text-[10rem] font-bold leading-none">404</span>
      <h1 className="mb-8">Not Found</h1>
      <Link className="bg-blue-500 hover:bg-blue-600 rounded-md p-2" href="/">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
