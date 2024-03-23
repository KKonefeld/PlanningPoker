import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container h-10 mx-auto  flex flex-col items-center pt-24">
      <h1>Scrum Poker for agile Teams</h1>
      <div className="flex gap-4 mt-8 text-white">
        <Link href="/rooms">
          <Button>Active rooms</Button>
        </Link>
        <Link href="/create">
          <Button>Create new room</Button>
        </Link>
      </div>
    </div>
  );
}
