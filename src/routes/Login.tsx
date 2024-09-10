import { useNavigate } from 'react-router-dom';
import api from '../configs/api';
import { useUser } from '../configs/outletContext';

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const res = await api.post('/auth/login', {
      username: target.username.value,
      password: target.password.value,
    });
    const data = await res.data;
    if (!data.user || !data.token) {
      return console.log('failed to login');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('userid', data.user.id);
    setUser(data.user);
    navigate('/');
  };
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username"></input>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password"></input>
        </div>
        <button type="submit">Login</button>
      </form>
      <button
        onClick={async () => {
          window.open('http://localhost:3000/auth/github', '_self');
        }}
      >
        Github
      </button>
    </>
  );
}
