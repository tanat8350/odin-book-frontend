import { useInfiniteQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import NewPostForm from '../components/NewPostForm';

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

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Home</h1>
      <NewPostForm refetch={refetch} />
      {user ? (
        <>
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
                  imageUrl={post.imageUrl}
                  originalPost={post.originalPost}
                  repostedBy={post.repostedBy}
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
                  imageUrl={post.imageUrl}
                  originalPost={post.originalPost}
                  repostedBy={post.repostedBy}
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
