import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <h1>Scrum Poker for agile Teams</h1>
      <div className="mt-8 flex gap-4 text-white">
        <Link href="/rooms">
          <Button>Active rooms</Button>
        </Link>
        <Link href="/create">
          <Button>Create new room</Button>
        </Link>
      </div>
    </>
  );
}
