import { useQuery } from 'react-query';
import api from '../configs/api';
import { Link } from 'react-router-dom';
import { User } from '../configs/type';
import { useState } from 'react';

export default function Search() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/user');
      return await res.data;
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Search</h1>
      <div>
        <input
          type="text"
          id="search"
          placeholder="search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul>
        {data
          .filter(
            (user: User) =>
              user.displayName.includes(search) ||
              user.username.includes(search)
          )
          .map((user: User) => {
            return (
              <li>
                <Link to={`/user/${user.id}`}>
                  {user.displayName} @{user.username}
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
}
