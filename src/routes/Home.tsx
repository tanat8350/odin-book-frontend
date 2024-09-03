import { useQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import PostCard from '../components/PostCard';

export default function Home() {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/post');
      // const res = await fetch('http://localhost:3000/posts');
      // return res.json();
      return await res.data;
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <form>
          <textarea></textarea>
          <button type="submit">Post</button>
        </form>
      ) : (
        <>
          {data.map((post) => (
            <PostCard
              // key={post.id}
              author={post.author}
              message={post.message}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </>
      )}
    </>
  );
}
