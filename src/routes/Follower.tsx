import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import { User } from '../configs/type';
import { useUser } from '../configs/outletContext';
import UserCard from '../components/UserCard';
import checkFollowingStatus from '../utils/checkFollowingStatus';
import { useState } from 'react';

export default function Follower() {
  const { user } = useUser();
  const { id } = useParams();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['followers', id],
    queryFn: async () => {
      const res = await api.get(`/user/${id}/follower`);
      return await res.data;
    },
  });

  if (isLoading) return <p>Loading</p>;
  return (
    <>
      <h1>{data.displayName}</h1>
      <h2>@{data.username}</h2>
      <h3>Followers ({data.followedBy.length})</h3>
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {data.followedBy.length > 0 &&
        data.followedBy
          .filter(
            (follower: User) =>
              follower.displayName.includes(search) ||
              follower.username.includes(search)
          )
          .map((filteredFollower: User) => (
            <UserCard
              user={filteredFollower}
              key={`follower-${filteredFollower.id}`}
            >
              {user?.id === id && (
                <button
                  key={`remove-${filteredFollower.id}`}
                  onClick={async () => {
                    const res = await api.delete(`/user/${user?.id}/follow`, {
                      data: { userid: filteredFollower.id },
                    });
                    const data = await res.data;
                    if (!data.success) {
                      console.log('failed to remove follower');
                    }
                    refetch();
                  }}
                >
                  Remove follower
                </button>
              )}

              {user?.id !== id &&
              user?.id !== filteredFollower.id &&
              checkFollowingStatus(user, filteredFollower) === 'pending' ? (
                <button
                  onClick={async () => {
                    const res = await api.delete(`/user/${user?.id}/request`, {
                      data: { userid: filteredFollower.id },
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
              ) : user?.id !== filteredFollower.id &&
                checkFollowingStatus(user, filteredFollower) === 'following' ? (
                <button
                  onClick={async () => {
                    const res = await api.delete(
                      `/user/${filteredFollower.id}/follow`,
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
                user?.id !== filteredFollower.id && (
                  <button
                    onClick={async () => {
                      const res = await api.post(
                        `/user/${filteredFollower.id}/follow`,
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
