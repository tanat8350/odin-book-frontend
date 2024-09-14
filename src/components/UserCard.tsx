import { Link } from 'react-router-dom';
import { User } from '../configs/type';
import blankAvatar from '../assets/blank-avatar.jpg';
import { ReactNode } from 'react';

export default function UserCard({
  user,
  children,
}: {
  user: User;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="followContainer">
        <img
          className="avatar"
          src={user.profileImage || blankAvatar}
          alt={user.username}
        />{' '}
        <div>
          <Link to={`/user/${user.id}`}>{user.displayName}</Link>{' '}
          <Link to={`/user/${user.id}`}>@{user.username}</Link>{' '}
          <Link to={`/user/${user.id}`}>{user.bio}</Link>{' '}
        </div>
        {children}
      </div>
    </>
  );
}
