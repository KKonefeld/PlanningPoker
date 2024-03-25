import { Room } from "@/model/room";
import { particpants } from "./paricipant-data";
import { VOTING_SYSTEM } from "@/model/user";

export const room1: Room = {
  id: 1,
  name: "Room 1",
  capacity: 10,
  createdAt: new Date().toISOString(),
  owner: particpants[0],
  publicKey: "1",
  votingSystem: VOTING_SYSTEM.FIBONACCI,
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Room 1",
    capacity: 10,
    createdAt: new Date().toISOString(),
    owner: particpants[0],
    publicKey: "1",
    votingSystem: VOTING_SYSTEM.FIBONACCI,
  },
  {
    id: 2,
    name: "Room 2",
    capacity: 8,
    createdAt: new Date().toISOString(),
    owner: particpants[6],
    publicKey: "2",
    votingSystem: VOTING_SYSTEM.TSHIRT,
  },
  {
    id: 3,
    name: "Room 3",
    capacity: 5,
    createdAt: new Date().toISOString(),
    owner: particpants[11],
    publicKey: "3",
    votingSystem: VOTING_SYSTEM.FIBONACCI,
  },
];
