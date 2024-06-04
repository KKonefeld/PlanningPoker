export enum VOTING_SYSTEM {
  FIBONACCI = "FIBONACCI",
  TSHIRTS = "TSHIRTS",
}

export interface Participant {
  id: number;
  name: string;
  role: string;
  vote?: string | null;
  status: string;
  connectionId: string;
  roomId: number;
}

export enum PARTICIPANT_ROLE {
  BASE = "BASE",
  OWNER = "OWNER",
}

export enum PARTICIPANT_STATUS {
  ACTIVE = "ACTIVE",
  DISCONNECTED = "DISCONNECTED",
}

export interface CurrentUser {
  userId: string;
  username: string;
  email: string;
}
