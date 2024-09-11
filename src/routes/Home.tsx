import { useQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';

export default function Home() {
  const { user } = useUser();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/post');
      return await res.data;
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      post: { value: string };
    };
    const res = await api.post('/post', {
      message: target.post.value,
      authorid: user?.id,
    });
    const data = await res.data;
    if (!data.success) {
      console.log('failed to post');
      return;
    }
    target.post.value = '';
    refetch();
  };

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          <form onSubmit={onSubmit}>
            <textarea id="post" placeholder="What is happening?"></textarea>
            <button type="submit">Post</button>
          </form>
          {/* // to change to user home later */}
          {data.map((post: Post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              message={post.message}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </>
      ) : (
        <>
          {data.map((post: Post) => (
            <PostCard
              key={post.id}
              id={post.id}
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
