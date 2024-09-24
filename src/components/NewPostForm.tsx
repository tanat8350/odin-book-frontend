import { useEffect, useRef, useState } from 'react';
import ImageUploadButton from './ImageUploadButton';
import { useUser } from '../configs/outletContext';
import api from '../configs/api';

interface NewPostFormProps {
  refetch: () => void;
}

export default function NewPostForm({ refetch }: NewPostFormProps) {
  const [image, setImage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textareaValue, setTextareaValue] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight - 16 + 'px';
    }
  }, [textareaValue]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const target = e.target as typeof e.target & {
      post: { value: string };
      imageUploader: { files: FileList; value: string };
    };
    let body;
    if (target.imageUploader.files) {
      body = new FormData();
      body.append('image', target.imageUploader.files[0]);
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
    setTextareaValue('');
    target.imageUploader.value = '';
    setImage('');
    refetch();
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      files: FileList;
    };
    setImage(URL.createObjectURL(target.files[0]));
  };

  if (!user) return null;

  return (
    <>
      {image && (
        <div className="imagePreviewContainer">
          <img className="postImage" src={image} alt="image preview" />
        </div>
      )}
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div>
          <ImageUploadButton
            text="Upload image"
            onChange={changeImage}
          ></ImageUploadButton>
        </div>
        <textarea
          id="post"
          placeholder="What is happening?"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          ref={textareaRef}
          rows={1}
          required
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </>
  );
}
