"use client";
import Deck from "@/components/ui/deck";
import {
  useJoinRoomMutation,
  useRoomDetailsQuery,
} from "@/queries/room.queries";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { VOTING_SYSTEM } from "@/model/user";
import NicknameForm from "./nicknameForm";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const [userNickname, setUserNickname] = useState<string | null>(null);

  const joinRoomMutation = useJoinRoomMutation({
    onSuccess: () => {
      console.log("Joined room");
    },
    onError: () => {
      console.log("Error joining room");
    },
  });

  const handleSetNickname = (nickname: string) => {
    setUserNickname(nickname);
  };

  useEffect(() => {
    if (!userNickname) return;
    joinRoomMutation.mutate({
      roomId: Number(params.roomId),
      nickname: userNickname,
    });
  }, []);

  // todo: wsadzić ''https://localhost:7008/' w consta gdzieś
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7008/roomHub")
    .build();

  useEffect(() => {
    if (!userNickname) return;
    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log("SignalR Connected");
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
  }, [params.roomId, userNickname]);

  useEffect(() => {
    if (!userNickname) return;
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((error) =>
            console.error("Error stopping SignalR connection:", error),
          );
      }
    };
  }, []);

  const roomId = params.roomId;

  const { data, isLoading, isError, error } = useRoomDetailsQuery(
    parseInt(roomId),
  );
  console.log(data);

  const submitVoteHandle = async (value: string | null) => {
    await connection.invoke(
      "SubmitVote",
      Number(params.roomId),
      userNickname,
      value,
    );
  };

  if (!userNickname) {
    return <NicknameForm setNickname={handleSetNickname} />;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }
  if (!data) {
    return <h1>No room</h1>;
  }

  return (
    <div>
      <h1 className="mb-8">{`Room ${params.roomId}`}</h1>
      <Deck
        votingSystem={VOTING_SYSTEM.FIBONACCI}
        submitVoteHandle={submitVoteHandle}
      ></Deck>
    </div>
  );
}
