import React from 'react';
import { useStore } from '../context/StoreContext';

export const BannerSection: React.FC = () => {
  const { bannerImage } = useStore();

  if (!bannerImage) return null;

  return (
    <div className="bg-black border-b border-purple-900/40 w-full overflow-hidden">
      <div className="w-full relative max-h-48 sm:max-h-60 overflow-hidden">
        <img
          src={bannerImage}
          alt="ApexStore Banner"
          className="w-full h-auto max-h-48 sm:max-h-60 object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
