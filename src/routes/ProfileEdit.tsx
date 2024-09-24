import { useQuery } from 'react-query';
import api from '../configs/api';
import React, { useState } from 'react';
import { useUser } from '../configs/outletContext';
import { useNavigate } from 'react-router-dom';
import blankAvatar from '../assets/blank-avatar.jpg';
import ImageUploadButton from '../components/ImageUploadButton';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');

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
      imageUploader: { files: FileList; length: number };
    };
    if (target.imageUploader.files.length === 0) {
      setImageError('Please select an image');
      return;
    }
    setImageError('');
    const formData = new FormData();
    formData.append('profileImage', target.imageUploader.files[0]);
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
    setImage(URL.createObjectURL(target.files[0]));
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

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      password: { value: string };
      newPassword: { value: string };
      confirmPassword: { value: string };
    };
    const res = await api.put(`/user/${user?.id}/profile/password`, {
      username: user?.username,
      password: target.password.value,
      newPassword: target.newPassword.value,
      confirmPassword: target.confirmPassword.value,
    });
    const data = await res.data;
    if (!data.success) {
      console.log('failed to update password');
      return;
    }
    target.password.value = '';
    target.newPassword.value = '';
    target.confirmPassword.value = '';
  };

  if (!user) return <p>Please login</p>;

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      <h1>Profile edit</h1>
      <div>
        <img
          className="imagePreview"
          id="imagePreview"
          src={image || user?.profileImage || blankAvatar}
          alt="profile image"
        />
      </div>
      {imageError && <p className="errMsg">{imageError}</p>}
      <form onSubmit={submitImage} encType="multipart/form-data">
        <ImageUploadButton
          text="Choose profile image"
          onChange={changeImage}
        ></ImageUploadButton>
        <button type="submit">Upload</button>
      </form>
      <br />
      <form onSubmit={submitPassword}>
        <div>
          <label htmlFor="password">Old password: </label>
          <input id="password" type="password" required></input>
        </div>
        <div>
          <label htmlFor="newPassword">New password: </label>
          <input id="newPassword" type="password" required></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm password: </label>
          <input id="confirmPassword" type="password" required></input>
        </div>
        <button type="submit">Update password</button>
      </form>
      <br />
      <form onSubmit={submitProfile}>
        <div>
          <label htmlFor="displayName">Display name: </label>
          <input
            type="text"
            id="displayName"
            value={displayName || ''}
            onChange={(e) => setDisplayName(e.target.value)}
            required
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
        <button
          onClick={async (e) => {
            e.preventDefault();
            const res = await api.delete(`/user/${user?.id}`);
            const data = await res.data;
            if (!data.success) {
              console.log('Failed to delete account');
              return;
            }
            localStorage.removeItem('token');
            localStorage.removeItem('userid');
            setUser(null);
            navigate('/');
          }}
        >
          Delete account
        </button>
      </form>
    </>
  );
}
