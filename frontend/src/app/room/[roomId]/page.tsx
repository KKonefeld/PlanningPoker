"use client";
import Deck from "@/app/room/[roomId]/deck";
import {
  useJoinRoomMutation,
  useRoomDetailsQuery,
} from "@/queries/room.queries";
import React, { use, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import NicknameForm from "./nicknameForm";
import Participants, { TParticipant } from "./participants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [gameState, setGameState] = useState<string>("");

  // TODO: filter participants - wywalić siebie jesli jest przekazywany
  const [participants, setParticipants] = useState<TParticipant[]>([]);
  const router = useRouter();

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

    console.log(connection);
  }, []);

  // todo: wsadzić 'https://localhost:7008/' w consta gdzieś
  useEffect(() => {
    if (!userNickname) return;
    const startConnection = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7008/roomHub")
          .build();

        console.log("SignalR Connected");

        connection.on("NoRoomInRoom", async () => {
          router.push('/rooms');
        });

        connection.on("UserJoined", async (participantName) => {
          console.log(`${participantName} joined the room!`);
        });

        connection.on("UserLeft", async (participantName) => {
          console.log(`${participantName} left the room.`);
        });

        connection.on("VoteSubmitted", async (participantName) => {
          console.log(`${participantName} submitted vote.`);
        });

        connection.on("VoteWithdrawn", async (participantName) => {
          console.log(`${participantName} withdrawn their vote.`);
        });

        connection.on("EveryoneVoted", async (bool) => {
          console.log(`Voting ready to finish: ${bool}.`);
          if (bool) {
            setGameState("finished");
          }
        });

        connection.on("VotingState", async (votingState) => {
          console.log("votingstate:", votingState);
          setParticipants(votingState);
          console.log("connection:", connection);
        });

        connection.on("VotingResults", async (votingResults) => {
          console.log(votingResults);
          setParticipants(votingResults);
        });

        await connection.start();

        await connection.invoke(
          "JoinRoom",
          Number(params.roomId),
          userNickname,
        );

        setConnection(connection);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    startConnection();
  }, [params.roomId, userNickname]);

  useEffect(() => {
    return () => {
      setConnection(null);
      if (connection) {
        connection.off("UserJoined");
        connection.off("UserLeft");
        connection.off("VoteSubmitted");
        connection.off("VoteWithdrawn");
        connection.off("EveryoneVoted");
        connection.off("VotingState");
        connection.off("VotingResults");
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((error) =>
            console.error("Error stopping SignalR connection:", error),
          );
        setConnection(null);
      }
    };
  }, []);

  const roomId = params.roomId;

  const { data, isLoading, isError, error } = useRoomDetailsQuery(
    parseInt(roomId),
  );

  const submitVoteHandle = async (value: string | null) => {
    if (!connection) return;
    console.log(value, connection.state);
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

  // todo: pokazywanie wyników po wciśnięciu przycisku
  return (
    <div>
      <h1 className="mb-8">{`Room ${data.name}`}</h1>

      <Button
        onClick={() => 
          {
          navigator.clipboard.writeText(window.location.href).then(() => 
            {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500); // Hide message after 1.5 seconds
          });
        }}
        className="mt-5 focus:outline-none"
      >
        {isCopied ? 'Link copied!' : 'Invite Participant'}
      </Button>

      <Deck
        votingSystem={data.votingSystem}
        submitVoteHandle={submitVoteHandle}
      ></Deck>
      <Participants participants={participants} />

      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={gameState != 'finished'} className="mt-5">Lock Voting</Button>
      </div> */}
    </div>
  );
}
