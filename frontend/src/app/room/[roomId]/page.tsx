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
import Dropzone from "react-dropzone";
import Papa from "papaparse";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsCard from "./usCard";
import UsList from "./usList";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [wrongFileFormatProvided, setwrongFileFormatProvided] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [gameState, setGameState] = useState<string>("");

  // TODO: filter participants - wywalić siebie jesli jest przekazywany
  const [participants, setParticipants] = useState<TParticipant[]>([]);
  const router = useRouter();

  const handleFileDrop = (acceptedFiles: any[]) => {
    const selectedFile = acceptedFiles[0];

    // 1. Basic validation
    if (selectedFile.type === "text/csv") {
      console.log("Uploaded file:", selectedFile);
      setIsUploadSuccessful(true);
      // Parse the CSV file using PapaParse
      Papa.parse(selectedFile, {
        complete: (results) => {
          const parsedData = results.data;
          console.log("Parsed CSV data:", parsedData);
        },
      });
    } else {
      // Not a CSV file
      setIsUploadSuccessful(false);
      setwrongFileFormatProvided(true);
    }

    // 2. File Upload Logic (replace with your implementation):

    // You can access the uploaded file object here
    // - selectedFile.name (original filename)
    // - selectedFile.type (MIME type)
    // - selectedFile.size (file size in bytes)

    // Implement your file upload logic here (e.g., send to server)
  };

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
    <div className="relative">
      <h1 className="mb-8">{`Room ${data.name}`}</h1>

      <div className="flex gap-2">
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
            <UsList />
          </SheetContent>
        </Sheet>
      </div>

      <Participants participants={participants} />

      <Deck
        votingSystem={data.votingSystem}
        submitVoteHandle={submitVoteHandle}
      ></Deck>

      <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <section {...getRootProps()}>
            <div className="dropzone-inner flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-8 hover:border-gray-500">
              <input {...getInputProps()} />
              <p className="dropzone-prompt mt-4 text-center text-gray-700">
                Drag 'n' drop a CSV file from JIRA here, or click to select
              </p>
              {isUploadSuccessful && (
                <div className="checkmark-container mt-4">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {/* Display error message if applicable */}
              {wrongFileFormatProvided && (
                <p className="upload-error mt-4 text-center text-red-500">
                  Please upload a CSV file.
                </p>
              )}
            </div>
          </section>
        )}
      </Dropzone>

      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={gameState != 'finished'} className="mt-5">Lock Voting</Button>
      </div> */}
    </div>
  );
}
