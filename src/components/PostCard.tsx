import { Link } from 'react-router-dom';

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

interface PostCardProps {
  message: string;
  timestamp: string;
  author: Author;
  likes: Likes;
  comments: Comments;
}

export default function PostCard({
  message,
  timestamp,
  author,
  likes,
  comments,
}: PostCardProps) {
  return (
    <div>
      <p>
        <Link to={`/user/${author.id}`}>
          {author.displayName} @{author.username}
        </Link>{' '}
        {new Date(timestamp).toLocaleString()}
      </p>
      <p>{message}</p>
      <p>
        Likes:{likes.length} Comments:{comments.length}
      </p>
    </div>
  );
}
