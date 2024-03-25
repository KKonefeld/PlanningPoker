import { Participant, VOTING_SYSTEM } from "@/model/user";
import { api } from "./client";
import { Room } from "@/model/room";
import { rooms } from "@/api-mock-data/room-data";

export namespace RoomApi {
  export const getRooms = async () => {
    // const res = await api.get<Room[]>("/room/all");
    // return res.data;
    return rooms;
  };

  export const getRoom = async (roomId: number) => {
    // const res = await api.get<Room>(`/room/${roomId}`);
    // return res.data;
    return rooms[roomId];
  };

  interface CreateRoomReq {
    votingSystem: VOTING_SYSTEM;
    capacity: number;
    name: string;
    owner: Participant;
  }

  interface CreateRoomRes {
    roomId: number;
  }

  export const createRoom = async (params: CreateRoomReq) => {
    // const res = await api.post<CreateRoomRes>("/room/create", { params });
    // return res.data;
    return { roomId: rooms.length + 1 };
  };

  interface JoinRoomRes {
    roomId: number;
  }

  export const joinRoom = async (roomId: number) => {
    // const res = await api.post<JoinRoomRes>(`/room/${roomId}/join`);
    // return res.data;
    return { roomId };
  };

  export const leaveRoom = async (roomId: number) => {
    // const res = await api.delete(`/room/${roomId}/leave`);
    // return res.data;
    return { roomId };
  };
}
