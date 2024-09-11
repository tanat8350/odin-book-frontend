import { Link, useParams } from 'react-router-dom';
import api from '../configs/api';
import { useQuery } from 'react-query';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';
import { useUser } from '../configs/outletContext';
import { useState } from 'react';

export default function Profile() {
  const { user } = useUser();
  const { id } = useParams();
  const [followingStatus, setFollowingStatus] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const res = await api.get(`/user/${id}`);
      const data = await res.data;
      setFollowingStatus('');
      for (const pending of data.requestPending) {
        if (pending.id === user?.id) {
          setFollowingStatus('pending');
          break;
        }
      }
      if (followingStatus) return data;
      for (const followedBy of data.followedBy) {
        if (followedBy.id === user?.id) {
          setFollowingStatus('following');
          break;
        }
      }
      return data;
    },
  });

  const clickFollowButton = async () => {
    const body = {
      userid: user?.id,
      pending: false,
    };
    if (followingStatus) {
      if (followingStatus === 'pending') body.pending = true;
      const res = await api.delete(`/user/${id}/follow`, {
        data: body,
      });
      const data = await res.data;
      if (!data.success) {
        console.log('failed to unfollow');
        return;
      }
    } else {
      const res = await api.post(`/user/${id}/follow`, {
        userid: user?.id,
      });
      const data = await res.data;
      if (!data.success) {
        console.log('failed to follow');
        return;
      }
    }
    refetch();
  };

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>{data.displayName}</h1>
      <h2>{data.bio}</h2>
      {data.id === user?.id ? (
        <Link to={'/user/edit'}>Edit profile</Link>
      ) : (
        <button onClick={clickFollowButton}>
          {followingStatus === 'following'
            ? 'Unfollow'
            : followingStatus === 'pending'
            ? 'Pending'
            : 'Follow'}
        </button>
      )}
      {/* // to add follow buttons */}
      <p>
        Following {data.following.length} Followed by {data.followedBy.length}
      </p>
      {data.posts.map((post: Post) => (
        <PostCard
          key={post.id}
          id={post.id}
          author={post.author}
          message={post.message}
          timestamp={post.timestamp}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </>
  );
}
