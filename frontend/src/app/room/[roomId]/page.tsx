"use client";
import Deck from "@/components/ui/deck";
import {
  useJoinRoomMutation,
  useRoomDetailsQuery,
} from "@/queries/room.queries";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter } from "next/navigation";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const router = useRouter();

  const joinRoomMutation = useJoinRoomMutation({
    onSuccess: () => {
      console.log("Joined room");
    },
    onError: () => {
      console.log("Error joining room");
    },
  });

  useEffect(() => {
    let nickname = prompt("provide nickname:");
    if (!nickname) router.replace(`/rooms`);
    setUserNickname(nickname);
    joinRoomMutation.mutate({
      roomId: Number(params.roomId),
      nickname: nickname!,
    });
  }, []);

  // todo: wsadzić ''https://localhost:7008/' w consta gdzieś
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7008/roomHub")
    .build();

  useEffect(() => {
    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log("SignalR Connected!");
          await connection.invoke(
            "JoinRoom",
            Number(params.roomId),
            userNickname,
          );
        } catch (error) {
          console.error("SignalR Connection Error:", error);
        }
      }
    };

    startConnection();
  }, [params.roomId]);

  useEffect(() => {
    return () => {
      connection
        .stop()
        .then(() => console.log("SignalR connection stopped"))
        .catch((error) =>
          console.error("Error stopping SignalR connection:", error),
        );
    };
  }, []);

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

  const submitVoteHandle = async (value: string | null) => {
    await connection.invoke(
      "SubmitVote",
      Number(params.roomId),
      userNickname,
      value,
    );
  };

  // fronciaki help to się powinno robić po kliknięciu w kartę
  // await connection.invoke('SubmitVote', Number(params.roomId), 'Participant Name', string voteValue);
  return (
    <div>
      <h1 className="mb-8">{`Room ${params.roomId}`}</h1>
      <Deck
        votingSystem={data.votingSystem}
        submitVoteHandle={submitVoteHandle}
      ></Deck>
    </div>
  );
}
