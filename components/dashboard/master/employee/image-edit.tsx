"use client";
import {
    XMarkIcon,
  } from '@heroicons/react/24/outline';

// import { robotoCondensed } from '../font';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { ChangeEvent, useState } from 'react';

interface ImageUploadProps {
  setImageUrlEdit: (url: string) => void;
    //setFormDataImage: (formData: FormData) => void; // Tambahkan prop untuk formDataImage
  }

const ImageEdit: React.FC<ImageUploadProps> = ({ setImageUrlEdit }) => {

    const [fileImage, setFileImage] = useState<string>("/noavatar.png");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
  
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if (file) {
          const imageName = file.name;
          const imageUrl = `/uploads/${imageName}`;
          setFileImage(imageUrl);
          setImageUrlEdit(imageUrl);
  
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
  
          // Mengirim file gambar ke server
          const formDataImage = new FormData();
          formDataImage.append('image', file);
  
          try {
              const res = await fetch('/api/upload', {
                  method: 'POST',
                  body: formDataImage    
              });
  
              console.log("Unggah File Berhasil");
              if (!res.ok) throw new Error(await res.text());
          } catch (error) {
              console.error('Error uploading image:', error);
          } 
      }
  };
  
  
    const handleCancelImage = () => {
      setImageUrlEdit("");
      setFileImage("");
      setPreviewImage(null);

    };

    return (
        <div>
            <div className='mb-4 '>
            <label htmlFor="image" className='mb-2 block text-sm font-medium cursor-pointer'>
                New Image :</label>
            <input
              type="file"
              id="picture"
              accept={fileImage} 
              name='picture'
              className={`text-sm font-medium p-2 gap-4 cursor-pointer`}
              onChange={handleImageChange}  
            />

            {previewImage && (
            <div className='flex items-center gap-2'>
              <Image className='border p-2 ' 
                src={previewImage} 
                alt="Preview" 
                width={150}
                height={150} />
              <Button variant="outline" size="icon" type="button" onClick={handleCancelImage}>
                <XMarkIcon className='text-red-600 h-4 w-4'/>
                </Button>
            </div>
            )}
      </div>
        </div>
    )
}
export default ImageEdit;