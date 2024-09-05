import { Link } from 'react-router-dom';
import { CommentCardProps } from '../configs/type';

export default function CommentCard({ comment }: CommentCardProps) {
  const timestampFormatted = new Date(comment.timestamp).toLocaleString();
  return (
    <div>
      <p>
        <Link to={`/user/${comment.author.id}`}>
          {comment.author.displayName} @{comment.author.username}
        </Link>{' '}
        {timestampFormatted}
      </p>
      <p>{comment.message}</p>
      {/* // to remove later */}
      <br></br>
    </div>
  );
}
