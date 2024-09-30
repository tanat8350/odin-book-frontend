import { useQuery } from 'react-query';
import api from '../configs/api';
import { useUser } from '../configs/outletContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChatList, User } from '../configs/type';
import blankAvatar from '../assets/blank-avatar.jpg';
import { chatLobbyDate } from '../utils/formatDate';

export default function Chat() {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ['chatUsers'],
    queryFn: async () => {
      const res = await api.get(`/chat/user/${currentUser?.id}`);
      const data = await res.data;
      console.log(data);
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
        <ul className="userChatCardWrapper">
          {data.map((list: ChatList) => {
            return list.users.map((user: User) => {
              if (currentUser.id !== user.id)
                return (
                  <li
                    key={list.id}
                    className="userChatCard"
                    onClick={() => navigate(`/chat/${user.id}`)}
                  >
                    <img
                      className="avatar"
                      src={user.profileImage || blankAvatar}
                      alt={user.username}
                    />
                    <div>
                      <Link to={`/chat/${user.id}`}>
                        {user.displayName} @{user.username}
                        {currentUser.id === user.id && ' (you)'}
                      </Link>
                      <p>
                        ({chatLobbyDate(list.chats[0].timestamp)}){' '}
                        {list.chats[0].author.id === currentUser.id && 'You: '}
                        {list.chats[0].message}
                      </p>
                    </div>
                  </li>
                );
            });
          })}
        </ul>
      )}
    </>
  );
}
