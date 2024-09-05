import { Link, useNavigate } from 'react-router-dom';
import { PostCardProps } from '../configs/type';
import api from '../configs/api';
import { useUser } from '../configs/outletContext';
import { useState } from 'react';

export default function PostCard({
  id,
  message,
  timestamp,
  author,
  likes,
  comments,
}: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [count, setCount] = useState(likes.length);

  return (
    <div>
      <p>
        <Link to={`/user/${author.id}`}>
          {author.displayName} @{author.username}
        </Link>{' '}
        {new Date(timestamp).toLocaleString()}
      </p>
      <p>{message}</p>
      <div>
        <button
          onClick={async () => {
            if (!user) return navigate('/login');
            const res = await api.put(`/post/${id}/like`, {
              userid: user?.id,
            });
            const data = await res.data;
            if (!data.success) {
              console.log('fail to like a post');
              return;
            }
            setCount(count + 1);
          }}
        >
          Likes:{count}
        </button>
        <button
          onClick={async () => {
            if (!user) return navigate('/login');
            const res = await api.delete(`/post/${id}/like`, {
              data: {
                userid: user?.id,
              },
            });
            const data = await res.data;
            if (!data.success) {
              console.log('fail to unlike a post');
              return;
            }
            setCount(count - 1);
          }}
        >
          Liked:{count}
        </button>
        <button onClick={() => navigate(`/post/${id}`)}>
          Comments:{comments.length}
        </button>
      </div>
    </div>
  );
}
