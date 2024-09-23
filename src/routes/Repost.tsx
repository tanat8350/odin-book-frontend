import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../configs/api';
import blankAvatar from '../assets/blank-avatar.jpg';
import { useUser } from '../configs/outletContext';
import { useState } from 'react';

interface RepostedUsers {
  users: (number | string)[][] | [];
  more: boolean;
}

export default function Repost() {
  const navigate = useNavigate();
  const { id: repostId } = useParams();
  const { user } = useUser();
  const [repostedUsers, setRepostedUsers] = useState<RepostedUsers>({
    users: [],
    more: false,
  });

  const { data, isLoading } = useQuery(['post', repostId], async () => {
    const res = await api.get(`/post/${repostId}`);
    const data = await res.data;
    console.log(data);
    return data;
  });

  useQuery({
    queryFn: async () => {
      const users = [];
      let more = false;
      for (const [
        index,
        {
          author: { id, displayName },
        },
      ] of data.repostedBy.entries()) {
        if (index === 3) {
          more = true;
          break;
        }
        // if (index === 0) {
        //   users = user.displayName;
        //   continue;
        // }
        // users = users + ', ' + user.displayName;
        users.push([id, displayName]);
      }
      setRepostedUsers({ users, more });
    },
    enabled: !!data,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      message: { value: string };
    };
    const res = await api.post(`/post/${repostId}/repost`, {
      message: target.message.value,
      authorid: user?.id,
    });
    const data = await res.data;
    if (!data.success) {
      console.log('failed to repost');
    }
    navigate(`/user/${user?.id}`);
  };

  if (isLoading) return <div>Loading</div>;
  return (
    <>
      <h1>Repost</h1>
      <form onSubmit={onSubmit}>
        <textarea id="message"></textarea>
        <button type="submit">Repost</button>
      </form>
      <div>
        <p>
          <img
            className="avatar"
            src={data.author.profileImage || blankAvatar}
          />{' '}
          <Link to={`/user/${data.author.id}`}>
            {data.author.displayName} @{data.author.username}
          </Link>{' '}
          {new Date(data.timestamp).toLocaleString()}
        </p>
        <p>{data.message}</p>
        {data.imageUrl && (
          <div className="imagePreviewContainer">
            <img
              className="postImage"
              src={data.imageUrl}
              alt={`postid_${repostId}_image`}
            />
          </div>
        )}
      </div>
      {repostedUsers.users.length > 0 && (
        <>
          <div>
            Reposted by{' '}
            {repostedUsers.users.map(([id, user], index) => {
              if (index === 2 && repostedUsers.more) {
                return (
                  <>
                    <Link to={`/user/${id}`}>{user}</Link>
                    <Link to={`/repost/${repostId}/user`}> and more</Link>
                  </>
                );
              }
              return <Link to={`/user/${id}`}>{user}, </Link>;
            })}
          </div>
        </>
      )}
    </>
  );
}
