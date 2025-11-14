
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  uploadedImage: { file: File, dataUrl: string } | null;
  onImageSelect: (file: File | null, dataUrl: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`cursor-pointer w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-300 ${isDragging ? 'border-purple-400 bg-gray-700' : 'border-gray-600 hover:border-purple-400 hover:bg-gray-800'}`}
      >
        <UploadIcon className="w-8 h-8 text-gray-500 mb-2" />
        <span className="text-gray-400 text-center">
          {uploadedImage ? `Change image` : `Drag & drop or click to upload`}
        </span>
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {uploadedImage && (
        <div className="mt-4 relative w-full group">
          <p className="text-xs text-gray-400 mb-2 text-center">Inspiration Image:</p>
          <img src={uploadedImage.dataUrl} alt="Uploaded preview" className="w-full h-auto max-h-36 object-contain rounded-lg" />
           <button 
              onClick={() => onImageSelect(null, null)}
              className="absolute top-0 right-0 m-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
      )}
    </div>
  );
};
