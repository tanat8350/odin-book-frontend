import { useQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import { User } from '../configs/type';
import { Link } from 'react-router-dom';

export default function Request() {
  const { user } = useUser();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['request'],
    queryFn: async () => {
      const res = await api.get(`/user/${user?.id}`);
      const data = await res.data;
      console.log(data);
      return await res.data;
    },
  });

  if (!user) return <p>Please login</p>;
  if (isLoading) return <p>Loading</p>;
  return (
    <>
      <h1>Pending requests</h1>
      <ul>
        {data?.requestPending.length > 0 ? (
          data?.requestPending.map((request: User) => {
            return (
              <li key={request.id}>
                <Link to={`/user/${request.id}`}>
                  {request.displayName} @{request.username}
                </Link>{' '}
                <button
                  onClick={async () => {
                    const res = await api.put(`/user/${request.id}/request`, {
                      userid: user?.id,
                    });
                    const data = await res.data;
                    if (!data.success) {
                      console.log('failed to accept the request');
                      return;
                    }
                    refetch();
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={async () => {
                    const res = await api.delete(
                      `/user/${request.id}/request`,
                      {
                        data: {
                          userid: user?.id,
                        },
                      }
                    );
                    const data = await res.data;
                    if (!data.success) {
                      console.log('failed to reject the request');
                      return;
                    }
                    refetch();
                  }}
                >
                  Reject
                </button>
              </li>
            );
          })
        ) : (
          <p>No pending requests</p>
        )}
      </ul>
    </>
  );
}
