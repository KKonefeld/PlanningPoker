import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <>
      <span className="text-[10rem] font-bold leading-none">404</span>
      <h1 className="mb-8">Not Found</h1>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </>
  );
};

export default NotFound;
