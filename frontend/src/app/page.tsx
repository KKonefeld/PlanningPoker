import Link from "next/link";

export default function Home() {
  return (
    <div className="container h-10 mx-auto  flex flex-col items-center pt-24">
      <h1>Scrum Poker for agile Teams</h1>
      <div className="flex gap-4 mt-8 text-white">
        <Link
          className="bg-blue-500 hover:bg-blue-600 rounded-md p-2"
          href="/rooms"
        >
          Active rooms
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-600 rounded-md p-2"
          href="/create"
        >
          Create new room
        </Link>
      </div>
    </div>
  );
}
