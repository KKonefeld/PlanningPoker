import { Participant, VOTING_SYSTEM } from "./user";

export interface Room {
  id: number;
  publicKey: string;
  name: string;
  capacity: number;
  createdAt?: string;
  votingSystem: VOTING_SYSTEM;
  owner: Participant;
}
