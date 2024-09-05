import { useQuery } from 'react-query';
import api from '../configs/api';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';
import { type Comment } from '../configs/type';
import { useUser } from '../configs/outletContext';

export default function Post() {
  const { user } = useUser();
  const { id } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      const res = await api.get(`/post/${id}`);
      return await res.data;
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      comment: { value: string };
    };
    const res = await api.post(`/post/${id}/comment`, {
      message: target.comment.value,
      authorid: user?.id,
    });
    const data = await res.data;
    if (!data.success) {
      console.log('fail to comment');
      return;
    }
    target.comment.value = '';
    refetch();
  };

  if (isLoading) return <p>Loading</p>;
  return (
    <>
      <h1>Post</h1>
      <PostCard
        key={data.id}
        id={data.id}
        author={data.author}
        message={data.message}
        timestamp={data.timestamp}
        likes={data.likes}
        comments={data.comments}
      />
      {user && (
        <form onSubmit={onSubmit}>
          <textarea id="comment" placeholder="Post your comment"></textarea>
          <button type="submit">Comment</button>
        </form>
      )}
      {data.comments.map((comment: Comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </>
  );
}
