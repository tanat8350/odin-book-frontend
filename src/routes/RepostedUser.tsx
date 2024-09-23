import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import { User } from '../configs/type';
import { useUser } from '../configs/outletContext';
import UserCard from '../components/UserCard';
import checkFollowingStatus from '../utils/checkFollowingStatus';
import { useState } from 'react';

export default function RepostedUser() {
  const { user } = useUser();
  const { id } = useParams();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['repostedUsers', id],
    queryFn: async () => {
      const res = await api.get(`/post/${id}/repost/user`);
      const data = await res.data;
      return data;
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Reposts ({data.length})</h1>
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {data.length > 0 &&
        data
          .filter(
            (post: { author: User }) =>
              post.author.displayName.includes(search) ||
              post.author.username.includes(search)
          )
          .map(({ author: filteredFollowing }: { author: User }) => (
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
