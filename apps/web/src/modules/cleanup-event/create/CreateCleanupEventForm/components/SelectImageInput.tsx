import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export const SelectImageInput = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-[400px] rounded-2xl h-[400px]">
      <input
        ref={inputFileRef}
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        hidden
      />
      <button
        onClick={() => inputFileRef.current?.click()}
        type="button"
        className="w-full h-full flex cursor-pointer bg-secondary hover:bg-secondary/80 transition-all items-center justify-center rounded-xl overflow-hidden"
      >
        {selectedImage ? (
          <Image
            src={URL.createObjectURL(selectedImage)}
            className={
              "object-cover max-w-xl w-full h-full hover:opacity-70 transition-opacity"
            }
            alt="Camera"
            width={576}
            height={320}
          />
        ) : (
          <CameraIcon className="w-12 h-12 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};
