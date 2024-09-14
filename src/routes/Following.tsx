import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import { User } from '../configs/type';
import { useUser } from '../configs/outletContext';
import UserCard from '../components/UserCard';
import checkFollowingStatus from '../utils/checkFollowingStatus';

export default function Following() {
  const { user } = useUser();
  const { id } = useParams();
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
      {data.following.length > 0 &&
        data.following.map((followingUser: User) => (
          <UserCard user={followingUser} key={`following-${followingUser.id}`}>
            {user?.id === id && (
              <button
                key={`remove-${followingUser.id}`}
                onClick={async () => {
                  const res = await api.delete(`/user/${user?.id}/follow`, {
                    data: { userid: followingUser.id },
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
            user?.id !== followingUser.id &&
            checkFollowingStatus(user, followingUser) === 'pending' ? (
              <button
                onClick={async () => {
                  const res = await api.delete(`/user/${user?.id}/request`, {
                    data: { userid: followingUser.id },
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
            ) : user?.id !== followingUser.id &&
              checkFollowingStatus(user, followingUser) === 'following' ? (
              <button
                onClick={async () => {
                  const res = await api.delete(
                    `/user/${followingUser.id}/follow`,
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
              user?.id !== followingUser.id && (
                <button
                  onClick={async () => {
                    const res = await api.post(
                      `/user/${followingUser.id}/follow`,
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
