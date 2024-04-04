import { Participant, VOTING_SYSTEM } from "@/model/user";
import { api } from "./client";
import { Room } from "@/model/room";
import { rooms } from "@/api-mock-data/room-data";

export namespace RoomApi {
  export const getRooms = async () => {
    const res = await api.get<Room[]>("/rooms");
    return res.data;
  };

  export const getRoom = async (roomId: number) => {
    const res = await api.get<Room>(`/rooms/${roomId}`);
    return res.data;
  };

  interface CreateRoomReq {
    name: string;
    capacity: number;
    votingSystem: VOTING_SYSTEM;
  }

  interface CreateRoomRes {
    roomId: number;
  }

  export const createRoom = async (params: CreateRoomReq) => {
    const res = await api.post<CreateRoomRes>("/rooms/create", params);
    return res.data;
  };

  interface JoinRoomRes {
    roomId: number;
  }

  export const joinRoom = async (data: {
    roomId: number;
    nickname: string;
  }) => {
    const roomId = data.roomId;
    const nickname = data.nickname;
    // const res = await api.post<JoinRoomRes>(`/room/${roomId}/join`);
    // return res.data;
    return { roomId, nickname };
  };

  export const leaveRoom = async (roomId: number) => {
    // const res = await api.delete(`/room/${roomId}/leave`);
    // return res.data;
    return { roomId };
  };
}
