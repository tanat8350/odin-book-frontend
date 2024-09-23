import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../configs/type';
import api from '../configs/api';
import { useUser } from '../configs/outletContext';
import { useEffect, useState } from 'react';
import blankAvatar from '../assets/blank-avatar.jpg';
import RepostCard from './RepostCard';

export default function PostCard({
  id,
  message,
  timestamp,
  author,
  likes,
  comments,
  imageUrl,
  originalPost,
  repostedBy,
}: Post) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [count, setCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(false);
    for (const likedUser of likes) {
      if (likedUser.id === user?.id) {
        setIsLiked(true);
        break;
      }
    }
  }, [likes, user?.id]);

  const clickLikeButton = async () => {
    if (!user) return navigate('/login');
    if (isLiked) {
      const res = await api.delete(`/post/${id}/like`, {
        data: {
          userid: user?.id,
        },
      });
      const data = await res.data;
      if (!data.success) {
        console.log('failed to unlike a post');
        return;
      }
      setCount(count - 1);
      setIsLiked(false);
    } else {
      const res = await api.put(`/post/${id}/like`, {
        userid: user?.id,
      });
      const data = await res.data;
      if (!data.success) {
        console.log('failed to like a post');
        return;
      }
      setCount(count + 1);
      setIsLiked(true);
    }
  };

  return (
    <div>
      <p>
        <img className="avatar" src={author.profileImage || blankAvatar} />{' '}
        <Link to={`/user/${author.id}`}>
          {author.displayName} @{author.username}
        </Link>{' '}
        {new Date(timestamp).toLocaleString()}
      </p>
      <p>{message}</p>
      {imageUrl && (
        <div className="imagePreviewContainer">
          <img
            className="postImage"
            src={imageUrl}
            alt={`postid_${id}_image`}
          />
        </div>
      )}
      {originalPost && (
        <div className="repostContainer">
          <RepostCard post={originalPost} />
        </div>
      )}
      <div>
        <button onClick={clickLikeButton}>
          {isLiked ? 'Liked' : 'Like'}: {count}
        </button>
        <button onClick={() => navigate(`/post/${id}`)}>
          Comments: {comments.length}
        </button>
        <button onClick={() => navigate(`/repost/${id}`)}>
          Repost: {repostedBy?.length}
        </button>
      </div>
    </div>
  );
}
