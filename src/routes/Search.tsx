import { useQuery } from 'react-query';
import api from '../configs/api';
import { Link } from 'react-router-dom';
import { Post, User } from '../configs/type';
import { useState } from 'react';
import PostCard from '../components/PostCard';

export default function Search() {
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
        const res = await api.get('/post');
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
            .map((user: User) => {
              return (
                <li key={user.id}>
                  <Link to={`/user/${user.id}`}>
                    {user.displayName} @{user.username}
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
              />
            );
          })}
    </>
  );
}
