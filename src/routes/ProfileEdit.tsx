import { useMutation, useQuery } from 'react-query';
import api from '../configs/api';
import { useState } from 'react';
import { useUser } from '../configs/outletContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['profileEdit'],
    queryFn: async () => {
      const res = await api.get(`/user/${user?.id}/profile`);
      const data = await res.data;
      setDisplayName(data.displayName);
      setBio(data.bio);
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api.put(`/user/${user?.id}/profile`, {
      displayName,
      bio,
    });
    const data = await res.data;
    if (!data) {
      console.log('fail to update user profile');
    }
    setUser(data);
    navigate(`/user/${user?.id}`);
  };

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: onSubmit,
    mutationKey: ['updateProfile'],
  });

  if (!user) return <p>Please login</p>;

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Profile Edit</h1>
      <form onSubmit={updateProfile}>
        <div>
          <label htmlFor="displayName">Display name: </label>
          <input
            type="text"
            id="displayName"
            value={displayName || ''}
            onChange={(e) => setDisplayName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="bio">Bio: </label>
          <input
            type="text"
            id="bio"
            value={bio || ''}
            onChange={(e) => setBio(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="profileImage">Profile image: </label>
          <input
            type="file"
            id="profileImage"
            accept="image/jpeg, image/jpg, image/png"
          ></input>
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
}
