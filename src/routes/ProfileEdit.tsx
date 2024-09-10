import { useQuery } from 'react-query';
import api from '../configs/api';
import { useState } from 'react';
import { useUser } from '../configs/outletContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [image, setImage] = useState({
    src: '' as string | undefined,
    alt: '' as string,
  });

  const { isLoading } = useQuery({
    queryKey: ['profileEdit'],
    queryFn: async () => {
      const res = await api.get(`/user/${user?.id}/profile`);
      const data = await res.data;
      setDisplayName(data.displayName);
      setBio(data.bio);
      setIsPrivate(data.private);
    },
    enabled: !!user,
  });

  const submitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      profileImage: { files: FileList };
    };
    const formData = new FormData();
    formData.append('profileImage', target.profileImage.files[0]);
    const res = await api.put(`/user/${user?.id}/profile/image`, formData);
    const data = await res.data;
    if (!data) {
      console.log('failed to update profile image');
    }
    setUser(data);
    navigate(`/user/${user?.id}`);
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      files: FileList;
    };
    setImage({
      src: URL.createObjectURL(target.files[0]),
      alt: target.files[0].name,
    });
  };

  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api.put(`/user/${user?.id}/profile`, {
      displayName,
      bio,
      private: isPrivate,
    });
    const data = await res.data;
    if (!data) {
      console.log('failed to update user profile');
    }
    setUser(data);
    navigate(`/user/${user?.id}`);
  };

  if (!user) return <p>Please login</p>;

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Profile Edit</h1>
      <div>
        <img
          className="imagePreview"
          src={image.src || user?.profileImage || ''}
          alt={image.alt || ''}
        />
      </div>
      <form onSubmit={submitImage} encType="multipart/form-data">
        <div>
          <label htmlFor="profileImage">Profile image: </label>
          <input
            type="file"
            id="profileImage"
            accept="image/jpeg, image/jpg, image/png"
            onChange={changeImage}
          ></input>
        </div>
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={submitProfile}>
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
          Account type:{' '}
          <button
            className={isPrivate ? 'activeButton' : ''}
            onClick={(e) => {
              e.preventDefault();
              setIsPrivate(true);
            }}
          >
            Private
          </button>{' '}
          <button
            className={!isPrivate ? 'activeButton' : ''}
            onClick={(e) => {
              e.preventDefault();
              setIsPrivate(false);
            }}
          >
            Public
          </button>
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
}
