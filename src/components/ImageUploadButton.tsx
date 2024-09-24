interface ImageUploadButtonProps {
  text: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadButton({
  text,
  onChange,
}: ImageUploadButtonProps) {
  return (
    <>
      <label htmlFor="imageUploader" className="imageUploader">
        {text}
      </label>
      <input
        className="imageUploader"
        id="imageUploader"
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={onChange}
      />
    </>
  );
}
