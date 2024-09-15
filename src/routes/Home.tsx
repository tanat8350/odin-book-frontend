import { useInfiniteQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useUser();

  const { data, fetchNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await api.get(`/post/?page=${pageParam}`);
        const data = res.data;
        return data;
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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
          {data?.pages.map((page, index) => (
            <div key={index}>
              {page.map((post: Post) => (
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
            </div>
          ))}
          <div ref={ref}>{isFetchingNextPage && 'Loading'}</div>
        </>
      ) : (
        <>
          {data?.pages.map((page, index) => (
            <div key={index}>
              {page.map((post: Post) => (
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
            </div>
          ))}
          <div ref={ref}>{isFetchingNextPage && 'Loading'}</div>
        </>
      )}
    </>
  );
}
