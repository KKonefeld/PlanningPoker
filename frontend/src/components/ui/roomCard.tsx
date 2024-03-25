import React from "react";
import { Room } from "@/model/room";
import { Button } from "./button";
import { useJoinRoomMutation } from "@/queries/room.queries";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const router = useRouter();

  const joinRoomMutation = useJoinRoomMutation({
    onSuccess: () => {
      router.push(`/room/${room.id}`);
      console.log("Joined room");
    },
    onError: () => {
      console.log("Error joining room");
    },
  });

  const onJoinButtonPress = () => {
    joinRoomMutation.mutate(room.id);
  };

  return (
    <div
      key={room.id}
      className="flex min-w-60 flex-col rounded-lg bg-white p-4"
    >
      <div className="flex flex-row gap-2">
        <h2 className="text-lg font-bold text-black">{room.name}</h2>
        <h2 className="text-lg font-bold italic text-black/20">
          {room.votingSystem}
        </h2>
      </div>
      <p className="mb-8 text-sm font-semibold text-black">
        Current players: {room.currentPlayersCount}/{room.capacity}
      </p>
      <Button
        className="ml-auto items-end justify-end self-end"
        onClick={onJoinButtonPress}
      >
        Join room
      </Button>
    </div>
  );
};
