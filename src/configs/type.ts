export interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  requestPending: User[];
  followedBy: User[];
  private: boolean;
}

export interface Context {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Post card
interface Comments {
  length: number;
}
export interface Post {
  id: number;
  message: string;
  imageUrl: string;
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
