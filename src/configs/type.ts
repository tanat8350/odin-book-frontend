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
  originalPost?: Post;
  repostedBy?: User[];
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

export interface ChatMessages {
  id?: number;
  message: string;
  author: User;
  timestamp: string;
}
export interface ChatList {
  id: string;
  chats: ChatMessages[];
  users: User[];
}
