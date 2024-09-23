import { useQuery } from 'react-query';
import api from '../configs/api';
import { Link } from 'react-router-dom';
import { Post, User } from '../configs/type';
import { useState } from 'react';
import PostCard from '../components/PostCard';
import { useUser } from '../configs/outletContext';
import blankAvatar from '../assets/blank-avatar.jpg';

export default function Search() {
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('user');

  const { data, isLoading } = useQuery({
    queryKey: ['search', type],
    queryFn: async () => {
      if (type === 'user') {
        const res = await api.get('/user');
        return await res.data;
      }
      if (type === 'post') {
        const res = await api.get('/post/all');
        return await res.data;
      }
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Search</h1>
      <button
        className={type === 'user' ? 'activeButton' : ''}
        onClick={() => setType('user')}
      >
        User
      </button>
      <button
        className={type === 'post' ? 'activeButton' : ''}
        onClick={() => setType('post')}
      >
        Post
      </button>
      <div>
        <input
          type="text"
          id="search"
          placeholder="search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {type === 'user' && (
        <ul>
          {data
            .filter(
              (user: User) =>
                user.displayName.includes(search) ||
                user.username.includes(search)
            )
            .map((filteredUser: User) => {
              return (
                <li key={filteredUser.id}>
                  <img
                    className="avatar"
                    src={filteredUser.profileImage || blankAvatar}
                    alt={filteredUser.username}
                  />{' '}
                  <Link to={`/user/${filteredUser.id}`}>
                    {filteredUser.displayName} @{filteredUser.username}{' '}
                    {filteredUser.id === user?.id && '(you)'}
                  </Link>
                </li>
              );
            })}
        </ul>
      )}
      {type === 'post' &&
        data
          .filter(
            (post: Post) =>
              post.message.includes(search) ||
              post.author.username.includes(search) ||
              post.author.displayName.includes(search)
          )
          .map((post: Post) => {
            return (
              <PostCard
                key={post.id}
                id={post.id}
                author={post.author}
                message={post.message}
                timestamp={post.timestamp}
                likes={post.likes}
                comments={post.comments}
                imageUrl={post.imageUrl}
                originalPost={post.originalPost}
                repostedBy={post.repostedBy}
              />
            );
          })}
    </>
  );
}
