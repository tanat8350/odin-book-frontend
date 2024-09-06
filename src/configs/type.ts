export interface User {
  id: number;
  username: string;
  displayName: string;
  requestPending: User[];
}

export interface Context {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Post card
interface Comments {
  length: number;
}
export interface PostCardProps {
  id: number;
  message: string;
  timestamp: string;
  author: User;
  likes: User[];
  comments: Comments;
}

export interface Comment {
  id: number;
  message: string;
  timestamp: string;
  author: User;
}
export interface CommentCardProps {
  comment: Comment;
}
