import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import { User } from '../configs/type';
import { useUser } from '../configs/outletContext';
import UserCard from '../components/UserCard';
import checkFollowingStatus from '../utils/checkFollowingStatus';

export default function Follower() {
  const { user } = useUser();
  const { id } = useParams();
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
      {data.followedBy.length > 0 &&
        data.followedBy.map((follower: User) => (
          <UserCard user={follower} key={`follower-${follower.id}`}>
            {user?.id === id && (
              <button
                key={`remove-${follower.id}`}
                onClick={async () => {
                  const res = await api.delete(`/user/${user?.id}/follow`, {
                    data: { userid: follower.id },
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
            user?.id !== follower.id &&
            checkFollowingStatus(user, follower) === 'pending' ? (
              <button
                onClick={async () => {
                  const res = await api.delete(`/user/${user?.id}/request`, {
                    data: { userid: follower.id },
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
            ) : user?.id !== follower.id &&
              checkFollowingStatus(user, follower) === 'following' ? (
              <button
                onClick={async () => {
                  const res = await api.delete(`/user/${follower.id}/follow`, {
                    data: { userid: user?.id },
                  });
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
              user?.id !== follower.id && (
                <button
                  onClick={async () => {
                    const res = await api.post(`/user/${follower.id}/follow`, {
                      userid: user?.id,
                    });
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
