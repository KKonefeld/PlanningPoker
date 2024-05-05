"use client";
import Deck from "@/app/room/[roomId]/deck";
import {
  useJoinRoomMutation,
  useRoomDetailsQuery,
} from "@/queries/room.queries";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import NicknameForm from "./nicknameForm";
import Participants, { TParticipant } from "./participants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UsList from "./userStories/usList";
import { UserStoryApi } from "@/api/userstory-api";
import { UserStory, UserStoryTask } from "@/model/userstory";

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
  const [userStories, setUserStories] = useState<UserStory[]>([]);

  const [votedTask, setVotedTask] = useState<UserStoryTask | null>(null);

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
          router.push("/rooms");
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

        connection.on("UserStoryAdded", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("CreatingUserStoryFailed", async (userStories) => {
          // todo: wyświetlić alert o błędzie
          console.log("Creating user story failed");
        });

        // todo: przyciski do edycji i usuwania user story
        connection.on("UserStoryUpdated", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("UpdatingUserStoryFailed", async () => {
          // todo: wyświetlić alert o błędzie
          console.log("Updating user story failed");
        });

        connection.on("UserStoryDeleted", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("DeletingUserStoryFailed", async () => {
          // todo: wyświetlić alert o błędzie
          console.log("Deleting user story failed");
        });

        connection.on("UserStoryTaskCreated", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("CreatingUserStoryTaskFailed", async () => {
          // todo: wyświetlić alert o błędzie
          console.log("Creating user story task failed");
        });

        connection.on("UserStoryTaskUpdated", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("UpdatingUserStoryTaskFailed", async () => {
          // todo: wyświetlić alert o błędzie
          console.log("Updating user story task failed");
        });

        connection.on("UserStoryTaskDeleted", async (userStories) => {
          setUserStories(userStories);
        });

        connection.on("DeletingUserStoryTaskFailed", async () => {
          // todo: wyświetlić alert o błędzie
          console.log("Deleting user story task failed");
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

        connection.off("UserStoryAdded");
        connection.off("CreatingUserStoryFailed");
        connection.off("UserStoryUpdated");
        connection.off("UpdatingUserStoryFailed");
        connection.off("UserStoryDeleted");
        connection.off("DeletingUserStoryFailed");

        connection.off("UserStoryTaskCreated");
        connection.off("CreatingUserStoryTaskFailed");
        connection.off("UserStoryTaskUpdated");
        connection.off("UpdatingUserStoryTaskFailed");
        connection.off("UserStoryTaskDeleted");
        connection.off("DeletingUserStoryTaskFailed");
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

  const addUserStoryHandle = async (title: string, description: string) => {
    if (!connection) return;
    await connection.invoke(
      "AddUserStory",
      Number(params.roomId),
      title,
      description,
    );
  };

  const updateUserStoryHandle = async (
    userStoryId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    await connection.invoke(
      "UpdateUserStory",
      Number(params.roomId),
      userStoryId,
      title,
      description,
    );
  };

  const deleteUserStoryHandle = async (userStoryId: number) => {
    if (!connection) return;
    await connection.invoke(
      "DeleteUserStory",
      Number(params.roomId),
      userStoryId,
    );
  };

  const createUserStoryTaskHandle = async (
    userStoryId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    await connection.invoke(
      "CreateUserStoryTask",
      Number(params.roomId),
      userStoryId,
      title,
      description,
    );
  };

  const updateUserStoryTaskHandle = async (
    userStoryTaskId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    await connection.invoke(
      "UpdateUserStoryTask",
      Number(params.roomId),
      userStoryTaskId,
      title,
      description,
    );
  };

  const deleteUserStoryTaskHandle = async (userStoryTaskId: number) => {
    if (!connection) return;
    await connection.invoke(
      "DeleteUserStoryTask",
      Number(params.roomId),
      userStoryTaskId,
    );
  };

  const setVotedTaskHandle = (task: UserStoryTask) => {
    setVotedTask(task);
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
    <div className="relative">
      <div className="mb-4 flex items-center justify-between border-b-2 border-white pb-4">
        <h1 className="mr-4">{`Room ${data.name}`}</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1500); // Hide message after 1.5 seconds
              });
            }}
          >
            {isCopied ? "Link copied!" : "Invite Participant"}
          </Button>
          <Sheet>
            <SheetTrigger className="">
              <Button>Show User Stories</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>User Stories</SheetTitle>
              </SheetHeader>
              <UsList
                roomId={Number(params.roomId)}
                createUserStoryHandle={addUserStoryHandle}
                deleteUserStoryHandle={deleteUserStoryHandle}
                updateUserStoryHandle={updateUserStoryHandle}
                addUserStoryHandle={addUserStoryHandle}
                createUserStoryTaskHandle={createUserStoryTaskHandle}
                deleteUserStoryTaskHandle={deleteUserStoryTaskHandle}
                updateUserStoryTaskHandle={updateUserStoryTaskHandle}
                setVotedTaskHandle={setVotedTaskHandle}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <h2>Participants</h2>
      <Participants participants={participants} />

      <div className="my-8 flex w-full items-center justify-center rounded-2xl border-2 border-white py-20">
        {votedTask?.title}
        {gameState}
      </div>

      <h2>Your deck</h2>
      <Deck
        votingSystem={data.votingSystem}
        submitVoteHandle={submitVoteHandle}
      ></Deck>

      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={gameState != 'finished'} className="mt-5">Lock Voting</Button>
      </div> */}
    </div>
  );
}
