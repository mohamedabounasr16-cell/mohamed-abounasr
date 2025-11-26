import React from 'react';
import { Scene } from '../types';
import { Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  onRetry: (sceneId: number) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, onRetry }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full">
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 border-b border-gray-100 group">
        {scene.imageUrl ? (
          <img 
            src={scene.imageUrl} 
            alt="Scene illustration" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : scene.isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-teal-600 gap-3">
            <Loader2 className="animate-spin w-10 h-10" />
            <span className="text-sm font-medium animate-pulse">جاري الرسم...</span>
          </div>
        ) : scene.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 gap-2 p-4 text-center">
            <span className="text-sm">حدث خطأ في الرسم</span>
            <button 
              onClick={() => onRetry(scene.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-100 flex items-center gap-2"
            >
              <RefreshCw size={14} /> إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ImageIcon className="w-16 h-16 opacity-50" />
          </div>
        )}
      </div>

      {/* Text Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
             <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">
                مشهد {scene.id}
             </span>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed font-medium">
          {scene.narrative_segment}
        </p>
      </div>
      
      {/* Decorative colored strip at bottom */}
      <div className="h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-orange-500"></div>
    </div>
  );
};

export default SceneCard;