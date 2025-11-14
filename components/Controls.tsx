
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';

interface ControlsProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    uploadedImage: { file: File, dataUrl: string } | null;
    onImageSelect: (file: File | null, dataUrl: string | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ prompt, setPrompt, uploadedImage, onImageSelect, onGenerate, isLoading }) => {
    return (
        <div className="w-full md:w-[400px] md:max-w-md p-4 md:p-0 flex flex-col gap-6">
            <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium text-gray-300">
                    1. Describe your wallpaper
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={uploadedImage ? "Add style keywords (e.g., 'cyberpunk, neon lights')" : "e.g., 'An astronaut riding a unicorn on the moon, digital art'"}
                    rows={4}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    disabled={isLoading}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                    2. Inspire with an image (optional)
                </label>
                <ImageUploader uploadedImage={uploadedImage} onImageSelect={onImageSelect} />
            </div>

            <button
                onClick={onGenerate}
                disabled={isLoading || (!prompt && !uploadedImage)}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
            >
                {isLoading ? (
                    'Generating...'
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Generate Wallpaper
                    </>
                )}
            </button>
        </div>
    );
};
