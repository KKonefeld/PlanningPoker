"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useEffect } from "react";
import { UserApi } from "@/api/user-api";
import { useRouter } from "next/navigation";
import { useUserHistoryQuery } from "@/queries/user.queries";

export default function Home() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isError, error } = useUserHistoryQuery();

  const getCurrentUser = async () => {
    if (userId) {
      const res = await UserApi.getCurrentUser();
      setUser(res);
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!userId) return null;

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <h1>No user data found</h1>
      </div>
    );
  }

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
      <div>
        {data.map((room) => (
          <div>
            <h2>{room.name}</h2>
            <p>{room.votingSystem}</p>
            <ul
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {room.userStories.map((story) => (
                <li key={story.id} style={{ margin: "10px" }}>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {story.tasks.map((task) => (
                      <li key={task.id} style={{ margin: "10px" }}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>{task.votingResult}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
