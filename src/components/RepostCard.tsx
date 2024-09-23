import { Link } from 'react-router-dom';
import { type Post } from '../configs/type';
import blankAvatar from '../assets/blank-avatar.jpg';

export default function RepostCard({
  post,
}: React.PropsWithoutRef<{ post: Post }>) {
  return (
    <div>
      <p>
        <img className="avatar" src={post.author.profileImage || blankAvatar} />{' '}
        <Link to={`/user/${post.author.id}`}>
          {post.author.displayName} @{post.author.username}
        </Link>{' '}
        {new Date(post.timestamp).toLocaleString()}
      </p>
      <p>{post.message}</p>
      {post.imageUrl && (
        <div className="imagePreviewContainer">
          <img
            className="postImage"
            src={post.imageUrl}
            alt={`postid_${post.id}_image`}
          />
        </div>
      )}
    </div>
  );
}
