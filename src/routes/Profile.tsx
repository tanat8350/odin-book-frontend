import { Link, useParams } from 'react-router-dom';
import api from '../configs/api';
import { useInfiniteQuery, useQuery } from 'react-query';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';
import { useUser } from '../configs/outletContext';
import { useEffect, useState } from 'react';
import blankAvatar from '../assets/blank-avatar.jpg';
import { useInView } from 'react-intersection-observer';

export default function Profile() {
  const { user } = useUser();
  const { id } = useParams();
  const [followingStatus, setFollowingStatus] = useState('');

  const {
    data: userData,
    isLoading: userIsLoading,
    refetch: userRefetch,
  } = useQuery({
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

  const {
    data: postData,
    fetchNextPage: postFetchNextPage,
    isFetchingNextPage: postIsFetchingNextPage,
    isLoading: postIsLoading,
  } = useInfiniteQuery({
    queryKey: ['userPosts', id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/user/${id}/post?page=${pageParam}`);
      const data = res.data;
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      postFetchNextPage();
    }
  }, [inView, postFetchNextPage]);

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
    userRefetch();
  };

  if (userIsLoading) return <p>Loading</p>;

  return (
    <>
      <img
        className="profileAvatar"
        src={userData.profileImage || blankAvatar}
        alt={userData.displayName}
      />{' '}
      {user &&
        (userData.id === user?.id ? (
          <Link to={'/user/edit'}>Edit profile</Link>
        ) : (
          <button onClick={clickFollowButton}>
            {followingStatus === 'following'
              ? 'Unfollow'
              : followingStatus === 'pending'
              ? 'Pending'
              : 'Follow'}
          </button>
        ))}
      <h1>{userData.displayName}</h1>
      <h2>{userData.username}</h2>
      <h2>{userData.bio}</h2>
      <p>
        <Link to={`/user/${userData.id}/following`}>
          {userData.following.length}
        </Link>{' '}
        Following{' '}
        <Link to={`/user/${userData.id}/follower`}>
          {userData.followedBy.length}
        </Link>{' '}
        Followers
      </p>
      {postIsLoading ? (
        <p>Loading</p>
      ) : (
        <>
          {postData?.pages.map((page, index) => (
            <div key={index}>
              {page.map((post: Post) => (
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
            </div>
          ))}
          <div ref={ref}>{postIsFetchingNextPage && 'Loading'}</div>
        </>
      )}
    </>
  );
}
