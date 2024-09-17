import { useInfiniteQuery } from 'react-query';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';
import PostCard from '../components/PostCard';
import { Post } from '../configs/type';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useUser();
  const [image, setImage] = useState('');

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
    if (!user) return;
    const target = e.target as typeof e.target & {
      post: { value: string };
      image: { files: FileList; value: string };
    };
    let body;
    if (target.image.files) {
      body = new FormData();
      body.append('image', target.image.files[0]);
      body.append('message', target.post.value);
      body.append('authorid', user?.id.toString());
    } else {
      body = {
        message: target.post.value,
        authorid: user?.id,
      };
    }
    const res = await api.post('/post', body);
    const data = await res.data;
    console.log(data);
    if (!data.success) {
      console.log('failed to post');
      return;
    }
    target.post.value = '';
    target.image.value = '';
    setImage('');
    refetch();
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      files: FileList;
    };
    setImage(URL.createObjectURL(target.files[0]));
  };

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          {image && (
            <div className="imagePreviewContainer">
              <img className="postImage" src={image} alt="image preview" />
            </div>
          )}
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div>
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/jpg, image/png"
                onChange={changeImage}
              />
            </div>
            <textarea
              id="post"
              placeholder="What is happening?"
              required
            ></textarea>
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
                  imageUrl={post.imageUrl}
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
                  imageUrl={post.imageUrl}
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
