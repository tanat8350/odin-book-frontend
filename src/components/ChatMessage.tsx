import { ChatMessages } from '../configs/type';
import { Link } from 'react-router-dom';
import blankAvatar from '../assets/blank-avatar.jpg';
import { chatDate } from '../utils/formatDate';

export default function ChatMessage({ message }: { message: ChatMessages }) {
  return (
    <p>
      <img
        className="avatar"
        src={message.author.profileImage || blankAvatar}
        alt={message.author.username}
      />{' '}
      {/* {new Date(message.timestamp).toLocaleString()}{' '} */}
      {chatDate(message.timestamp)}{' '}
      <Link to={`/user/${message.author.id}`}>
        {message.author.displayName} @{message.author.username}
      </Link>{' '}
      {message.message}
    </p>
  );
}
