import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import { User } from '../configs/type';
import { useUser } from '../configs/outletContext';
import UserCard from '../components/UserCard';
import checkFollowingStatus from '../utils/checkFollowingStatus';
import { useState } from 'react';

export default function Following() {
  const { user } = useUser();
  const { id } = useParams();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['following', id],
    queryFn: async () => {
      const res = await api.get(`/user/${id}/following`);
      return await res.data;
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>{data.displayName}</h1>
      <h2>@{data.username}</h2>
      <h3>Following ({data.following.length})</h3>
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {data.following.length > 0 &&
        data.following
          .filter(
            (following: User) =>
              following.displayName.includes(search) ||
              following.username.includes(search)
          )
          .map((filteredFollowing: User) => (
            <UserCard
              user={filteredFollowing}
              key={`following-${filteredFollowing.id}`}
            >
              {user?.id === id && (
                <button
                  key={`remove-${filteredFollowing.id}`}
                  onClick={async () => {
                    const res = await api.delete(`/user/${user?.id}/follow`, {
                      data: { userid: filteredFollowing.id },
                    });
                    const data = await res.data;
                    if (!data.success) {
                      console.log('failed to remove follower');
                    }
                    refetch();
                  }}
                >
                  Remove followingUser
                </button>
              )}

              {user?.id !== id &&
              user?.id !== filteredFollowing.id &&
              checkFollowingStatus(user, filteredFollowing) === 'pending' ? (
                <button
                  onClick={async () => {
                    const res = await api.delete(`/user/${user?.id}/request`, {
                      data: { userid: filteredFollowing.id },
                    });
                    const data = res.data;
                    if (!data.success) {
                      console.log('failed to cancel request');
                    }
                    refetch();
                  }}
                >
                  Cancel request
                </button>
              ) : user?.id !== filteredFollowing.id &&
                checkFollowingStatus(user, filteredFollowing) ===
                  'following' ? (
                <button
                  onClick={async () => {
                    const res = await api.delete(
                      `/user/${filteredFollowing.id}/follow`,
                      {
                        data: { userid: user?.id },
                      }
                    );
                    const data = res.data;
                    if (!data.success) {
                      console.log('failed to unfollow');
                    }
                    refetch();
                  }}
                >
                  Unfollow
                </button>
              ) : (
                user &&
                user?.id !== filteredFollowing.id && (
                  <button
                    onClick={async () => {
                      const res = await api.post(
                        `/user/${filteredFollowing.id}/follow`,
                        {
                          userid: user?.id,
                        }
                      );
                      const data = await res.data;
                      if (!data.success) {
                        console.log('failed to follow');
                      }
                      refetch();
                    }}
                  >
                    Follow
                  </button>
                )
              )}
            </UserCard>
          ))}
    </>
  );
}
