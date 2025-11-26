import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface StoryInputProps {
  onAnalyze: (story: string) => void;
  isAnalyzing: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-4 border-amber-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-lg">1</span>
        أدخل القصة هنا
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full h-48 p-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all resize-none text-lg leading-relaxed text-gray-700"
          placeholder="اكتب قصة قصيرة هنا... مثلاً: كان هناك طفل صغير اسمه كريم يعيش في مدينة مراكش القديمة..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing || !text.trim()}
            className={`
              flex items-center gap-3 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1
              ${isAnalyzing || !text.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:shadow-teal-200'}
            `}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                اصنع السحر
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryInput;