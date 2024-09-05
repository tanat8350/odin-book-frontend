export interface User {
  id: number;
  username: string;
  displayName: string;
}

export interface Context {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Post card
interface Author {
  username: string;
  id: number;
  displayName: string;
}
interface Likes {
  length: number;
}
interface Comments {
  length: number;
}
export interface PostCardProps {
  id: number;
  message: string;
  timestamp: string;
  author: Author;
  likes: Likes;
  comments: Comments;
}

export interface Comment {
  id: number;
  message: string;
  timestamp: string;
  author: Author;
}
export interface CommentCardProps {
  comment: Comment;
}
