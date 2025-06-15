
export interface User {
  id: string;
  name: string;
  vote: string | null;
  created_at: string;
}

export interface SessionData {
  id: string;
  votes_revealed: boolean;
}
