import { useInfiniteQuery, useQuery } from 'react-query';
import api from '../configs/api';
import { Link } from 'react-router-dom';
import { Post, User } from '../configs/type';
import { useEffect, useRef, useState } from 'react';
import PostCard from '../components/PostCard';
import { useUser } from '../configs/outletContext';
import blankAvatar from '../assets/blank-avatar.jpg';
import { useInView } from 'react-intersection-observer';

export default function Search() {
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('user');
  // prevent focus warning
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // prevent crashing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search]);

  const clearInputs = () => {
    setSearch('');
    setFilter('');
  };

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['search', type],
    queryFn: async () => {
      if (type === 'allusers') {
        const res = await api.get('/user');
        const data = await res.data;
        return data;
      }
      if (type === 'allposts') {
        const res = await api.get('/post/all');
        const data = await res.data;
        return data;
      }
    },
    enabled: type === 'allusers' || type === 'allposts',
  });

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['search', type, search],
      queryFn: async () => {
        if (type === 'user') {
          const res = await api.get(`/user/search?q=${search}`);
          const data = await res.data;
          return data;
        }
        if (type === 'post') {
          const res = await api.get(`/post/search?q=${search}`);
          return await res.data;
        }
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) {
          return undefined;
        }
        return pages.length + 1;
      },
      enabled: !!search && type !== 'allusers',
    });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading || allLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Search</h1>
      <div>
        <button
          className={type === 'user' ? 'activeButton' : ''}
          onClick={() => {
            clearInputs();
            setType('user');
          }}
        >
          User
        </button>
        <button
          className={type === 'post' ? 'activeButton' : ''}
          onClick={() => {
            clearInputs();
            setType('post');
          }}
        >
          Post
        </button>
      </div>
      <div>
        <button
          className={type === 'allusers' ? 'activeButton' : ''}
          onClick={() => {
            clearInputs();
            setType('allusers');
          }}
        >
          All users
        </button>
        <button
          className={type === 'allposts' ? 'activeButton' : ''}
          onClick={() => {
            clearInputs();
            setType('allposts');
          }}
        >
          All users
        </button>
      </div>
      {(type === 'user' || type === 'post') && (
        <div>
          <input
            type="text"
            id="search"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchInputRef}
          />
        </div>
      )}
      {type === 'user' && (
        <>
          <ul>
            {search &&
              data?.pages.map((page, index) => (
                <div key={index}>
                  {page.map((filteredUser: User) => (
                    <li key={filteredUser.id}>
                      <img
                        className="avatar"
                        src={filteredUser.profileImage || blankAvatar}
                        alt={filteredUser.username}
                      />{' '}
                      <Link to={`/user/${filteredUser.id}`}>
                        {filteredUser.displayName} @{filteredUser.username}{' '}
                        {filteredUser.id === user?.id && '(you)'}
                      </Link>
                    </li>
                  ))}
                </div>
              ))}
          </ul>
        </>
      )}
      {search &&
        type === 'post' &&
        data?.pages.map((page, index) => (
          <>
            <div key={index}>
              {page.map((post: Post) => {
                return (
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
                );
              })}
            </div>
          </>
        ))}
      {(type === 'user' || type === 'post') && (
        <div ref={ref}>{isFetchingNextPage && 'Loading'}</div>
      )}
      {(type === 'allusers' || type === 'allposts') && (
        <div>
          <input
            type="text"
            placeholder="filter"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          ></input>
        </div>
      )}
      {type === 'allusers' && (
        <>
          <ul>
            {allData
              .filter(
                (user: User) =>
                  user.username.includes(filter) ||
                  user.displayName.includes(filter)
              )
              .map((filteredUser: User) => (
                <li key={filteredUser.id}>
                  <img
                    className="avatar"
                    src={filteredUser.profileImage || blankAvatar}
                    alt={filteredUser.username}
                  />{' '}
                  <Link to={`/user/${filteredUser.id}`}>
                    {filteredUser.displayName} @{filteredUser.username}{' '}
                    {filteredUser.id === user?.id && '(you)'}
                  </Link>
                </li>
              ))}
          </ul>
        </>
      )}
      {type === 'allposts' &&
        allData
          .filter(
            (post: Post) =>
              post.message.includes(filter) ||
              post.author.username.includes(filter) ||
              post.author.displayName.includes(filter)
          )
          .map((filteredPost: Post) => (
            <PostCard
              key={filteredPost.id}
              id={filteredPost.id}
              author={filteredPost.author}
              message={filteredPost.message}
              timestamp={filteredPost.timestamp}
              likes={filteredPost.likes}
              comments={filteredPost.comments}
              imageUrl={filteredPost.imageUrl}
              originalPost={filteredPost.originalPost}
              repostedBy={filteredPost.repostedBy}
            />
          ))}
    </>
  );
}
