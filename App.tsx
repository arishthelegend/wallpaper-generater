
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { Controls } from './components/Controls';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File | null, dataUrl: string | null) => {
    if (file && dataUrl) {
      setUploadedImage({ file, dataUrl });
    } else {
      setUploadedImage(null);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt && !uploadedImage) {
      setError("Please provide a prompt or an image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    let imagePayload;
    if (uploadedImage) {
        const [header, base64Data] = uploadedImage.dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1];
        if (base64Data && mimeType) {
            imagePayload = { data: base64Data, mimeType };
        }
    }

    try {
      const imageUrl = await generateImage(prompt, imagePayload);
      setGeneratedImageUrl(imageUrl);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-10 flex flex-col md:flex-row gap-12 md:gap-8 items-start justify-center">
          <Controls 
            prompt={prompt}
            setPrompt={setPrompt}
            uploadedImage={uploadedImage}
            onImageSelect={handleImageSelect}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <ImageViewer 
            imageUrl={generatedImageUrl}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
