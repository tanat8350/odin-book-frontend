import { Link, useParams } from 'react-router-dom';
import api from '../configs/api';
import { useQuery } from 'react-query';
import PostCard from '../components/PostCard';
import { PostCardProps } from '../configs/type';

export default function Profile() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get(`/user/${id}`);
      return await res.data;
    },
  });

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>{data.displayName}</h1>
      <h2>{data.bio}</h2>
      <Link to={'/user/edit'}>Edit profile</Link>
      <p>
        Following {data.following.length} Followed by {data.followedBy.length}
      </p>
      {data.posts.map((post: PostCardProps) => (
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
  );
}
