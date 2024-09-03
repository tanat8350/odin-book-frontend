import { useNavigate } from 'react-router-dom';
import api from '../configs/api';

export default function Signup() {
  const navigate = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
      passwordVerify: { value: string };
    };
    const res = await api.post('/signup', {
      username: target.username.value,
      password: target.password.value,
      passwordVerify: target.passwordVerify.value,
    });
    const data = await res.data;
    console.log(data);
    navigate('/login');
  };
  return (
    <>
      <h1>Signup</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username"></input>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password"></input>
        </div>
        <div>
          <label htmlFor="passwordVerify">Verify Password: </label>
          <input type="password" id="passwordVerify"></input>
        </div>
        <button type="submit">Signup</button>
      </form>
    </>
  );
}
