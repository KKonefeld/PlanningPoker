"use client";
import Deck from "@/components/ui/deck";
import { useRoomDetailsQuery } from "@/queries/room.queries";
import React from "react";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const roomId = params.roomId;

  const { data, isLoading, isError, error } = useRoomDetailsQuery(
    parseInt(roomId),
  );
  console.log(data);

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
        <h1>No room</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8">{`Room ${params.roomId}`}</h1>
      <Deck votingSystem={data.votingSystem}></Deck>
    </div>
  );
}
