"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useEffect } from "react";
import { UserApi } from "@/api/user-api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const userId = localStorage.getItem("userId");

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
