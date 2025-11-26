import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 p-2 rounded-full text-teal-900">
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">حكايات مغربية</h1>
            <p className="text-teal-200 text-sm font-medium">حول قصتك إلى رسومات كرتونية ملونة</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-teal-800 px-3 py-1 rounded-full border border-teal-600">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-xs">مدعوم بالذكاء الاصطناعي</span>
        </div>
      </div>
    </header>
  );
};

export default Header;