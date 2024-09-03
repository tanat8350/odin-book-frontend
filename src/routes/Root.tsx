import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { type User } from '../configs/type';

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to={`/user/${user.id}`}>{user.username}</Link>
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
