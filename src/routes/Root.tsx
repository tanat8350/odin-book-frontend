import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { type User } from '../configs/type';
import api from '../configs/api';
import { useQuery } from 'react-query';

export default function Root() {
  const [user, setUser] = useState<User | null>(null);

  useQuery({
    queryFn: async () => {
      if (localStorage.getItem('userid')) {
        const res = await api.get(`/user/${localStorage.getItem('userid')}`);
        const data = await res.data;
        setUser(data);
      }
    },
  });

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/request">
                  Request ({user.requestPending.length})
                </Link>
              </li>
              <li>
                <Link to={`/user/${user.id}`}>
                  {user.displayName} @{user.username}
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  onClick={async (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('userid');
                    setUser(null);
                  }}
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet context={{ user, setUser }} />
    </>
  );
}
