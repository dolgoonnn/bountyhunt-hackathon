// src/server/auth/types.ts
export interface Session {
  user: {
    id: string;
    address: string;
    reputation: number;
  };
}
