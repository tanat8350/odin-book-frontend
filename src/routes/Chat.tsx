import { useQuery } from 'react-query';
import api from '../configs/api';
import { useUser } from '../configs/outletContext';
import { Link } from 'react-router-dom';
import { User } from '../configs/type';
import blankAvatar from '../assets/blank-avatar.jpg';

export default function Chat() {
  const { user: currentUser } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ['chatUsers'],
    queryFn: async () => {
      const res = await api.get('/user');
      const data = await res.data;
      return data;
    },
    enabled: !!currentUser,
  });
  if (!currentUser) return <p>Please login</p>;

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Chat</h1>
      {data.length > 0 && (
        <ul>
          {data.map((user: User, index: number) => {
            return (
              <li key={index}>
                <img
                  className="avatar"
                  src={user.profileImage || blankAvatar}
                  alt={user.username}
                />{' '}
                <Link to={`/chat/${user.id}`}>
                  {user.displayName} @{user.username}
                  {currentUser.id === user.id && ' (you)'}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
