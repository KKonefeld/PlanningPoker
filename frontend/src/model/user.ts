export enum VOTING_SYSTEM {
  FIBONACCI = "FIBBONACI",
  TSHIRT = "TSHIRT",
}

export interface Participant {
  id: number;
  name: string;
  choice?: string | null;
  roomKey?: string | null;
}
