import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { type User } from '../configs/type';

export default function Root() {
  const [user, setUser] = useState<User | null>(null);

  // to remove later
  useEffect(() => {
    setUser({
      id: 1,
      username: 'a',
      displayName: 'a1',
    });
  }, []);
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Explore</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/request">Request</Link>
              </li>
              <li>
                <Link to={`/user/${user.id}`}>
                  {user.displayName} @{user.username}
                </Link>
              </li>
              <li>
                <Link to="/logout">Logout</Link>
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
