"use client";
import Deck from "@/components/ui/deck";
import { useRoomDetailsQuery } from "@/queries/room.queries";
import React, { useEffect } from "react";
import * as signalR from '@microsoft/signalr';

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {

  // todo: wsadzić ''https://localhost:7008/' w consta gdzieś
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7008/roomHub')
    .build();

  useEffect(() => {
    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log('SignalR Connected!');
          await connection.invoke('JoinRoom', Number(params.roomId), 'Participant Name')
        } catch (error) {
          console.error('SignalR Connection Error:', error);
        }
      }
    };
  
    startConnection();
  
    return () => {
      // frontasie help za wcześnie się odpala to
      // connection.stop()
      //   .then(() => console.log('SignalR connection stopped'))
      //   .catch(error => console.error('Error stopping SignalR connection:', error));
    };
  }, [params.roomId]);
  
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

  // fronciaki help to się powinno robić po kliknięciu w kartę
  // await connection.invoke('SubmitVote', Number(params.roomId), 'Participant Name', string voteValue);
  return (
    <div>
      <h1 className="mb-8">{`Room ${params.roomId}`}</h1>
      <Deck votingSystem={data.votingSystem}></Deck>
    </div>
  );
}
