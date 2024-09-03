export interface User {
  id: number;
  username: string;
}

export interface Context {
  user: User | null;
  setUser: (user: User | null) => void;
}
