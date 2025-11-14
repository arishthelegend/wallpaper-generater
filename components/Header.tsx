
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-4 md:py-6 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
        <SparklesIcon className="w-8 h-8 text-purple-400" />
        AI Wallpaper Studio
      </h1>
      <p className="text-gray-400 mt-2 text-md md:text-lg">Create your next phone background with AI</p>
    </header>
  );
};
