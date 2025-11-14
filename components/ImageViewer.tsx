
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageViewerProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="font-semibold text-lg text-gray-400">Your generated wallpaper will appear here.</h3>
        <p className="text-sm">Enter a prompt or upload an image to start.</p>
    </div>
);

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, isLoading, error }) => {
    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-wallpaper-${Date.now()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full md:w-auto md:flex-1 flex flex-col items-center justify-center">
            <div className="aspect-[9/16] w-full max-w-[320px] bg-gray-800 rounded-3xl shadow-lg overflow-hidden relative border-4 border-gray-700">
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-center text-red-400 p-4">{error}</div>
                ) : imageUrl ? (
                    <img src={imageUrl} alt="Generated wallpaper" className="w-full h-full object-cover" />
                ) : (
                    <Placeholder />
                )}
            </div>
            {imageUrl && !isLoading && !error && (
                <button
                    onClick={handleDownload}
                    className="mt-6 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-lg"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
            )}
        </div>
    );
};
