import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUser } from '../configs/outletContext';
import { ChatMessages } from '../configs/type';
import { useParams } from 'react-router-dom';
import api from '../configs/api';
import { useQuery } from 'react-query';
import ChatMessage from '../components/ChatMessage';

export default function ChatRoom() {
  const socket = io('http://localhost:3000');
  const { user } = useUser();
  const { id: targetId } = useParams();
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (!user || !targetId) return;
    const id = [user?.id, targetId];
    const sorted = id.sort((a, b) => {
      return +a - +b;
    });
    const roomId = `${sorted[0]}-${sorted[1]}`;

    socket.emit('joinRoom', roomId);
    setRoomId(roomId);
    // useQuery cannot add socket as dependency
  }, [socket, user, targetId]);

  const { data: targetUser } = useQuery({
    queryKey: ['targetUser', targetId],
    queryFn: async () => {
      const res = await api.get(`/user/${targetId}`);
      const data = await res.data;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['chatUser', roomId],
    queryFn: async () => {
      const res = await api.get(`/chat/${roomId}`);
      const data = await res.data;
      setMessages([]);
      return data;
    },
    enabled: !!roomId,
  });

  useEffect(() => {
    if (!roomId) return;
    socket.on('getMessage', (data) => {
      console.log(data);
      setMessages([...messages, data]);
      // setMessages((prev) => [...prev, data]);
    });
  }, [roomId, socket, messages]);

  const submitSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      message: { value: string };
    };
    if (!target.message.value) return;
    socket.emit('sendMessage', {
      message: target.message.value,
      author: user,
      roomId,
    });
    target.message.value = '';
  };

  if (!user) return <p>Please login</p>;
  if (!targetId || !roomId) return <p>Please refresh</p>;

  return (
    <>
      <h1>
        Chat with {targetUser?.displayName} @{targetUser?.username}
      </h1>
      {isLoading && <p>Loading</p>}
      {data &&
        data.length > 0 &&
        data.map((message: ChatMessages) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      {messages.length > 0 &&
        messages.map((data, index) => (
          <ChatMessage key={index} message={data} />
        ))}
      <form onSubmit={submitSendMessage}>
        <input id="message" type="text" placeholder="Message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
