import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import StoryInput from './components/StoryInput';
import SceneCard from './components/SceneCard';
import { Scene } from './types';
import { analyzeStory, generateSceneImage } from './services/geminiService';
import { Palette } from 'lucide-react';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const generateImageForScene = useCallback(async (scene: Scene) => {
    // Set loading state for this specific scene
    setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, isLoading: true, error: undefined } : s));

    try {
      const imageUrl = await generateSceneImage(scene.visual_prompt);
      
      setScenes(prev => prev.map(s => 
        s.id === scene.id 
          ? { ...s, imageUrl, isLoading: false } 
          : s
      ));
    } catch (error) {
      console.error(`Error generating image for scene ${scene.id}:`, error);
      setScenes(prev => prev.map(s => 
        s.id === scene.id 
          ? { ...s, isLoading: false, error: 'Failed to generate image' } 
          : s
      ));
    }
  }, []);

  const handleAnalyzeStory = async (storyText: string) => {
    setIsAnalyzing(true);
    setGeneralError(null);
    setScenes([]);

    try {
      const analysis = await analyzeStory(storyText);
      
      // Initialize scenes structure
      const newScenes: Scene[] = analysis.scenes.map((item, index) => ({
        id: index + 1,
        narrative_segment: item.narrative_segment,
        visual_prompt: item.visual_prompt, // Prompt includes "Moroccan style"
        characters: item.characters,
        isLoading: true, // Start as loading immediately as we will trigger generation
      }));

      setScenes(newScenes);

      // Trigger image generation for all scenes
      // We do this sequentially to avoid rate limits on the preview model, or just use Promise.all if quota allows.
      // For UX, parallel is better, but safer to stagger slightly if needed. Let's try parallel.
      newScenes.forEach(scene => {
        generateImageForScene(scene);
      });

    } catch (error) {
      console.error("Story analysis failed:", error);
      setGeneralError("عذراً، لم نتمكن من تحليل القصة. يرجى التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryScene = (sceneId: number) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      generateImageForScene(scene);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-12">
        
        {/* Intro Section */}
        <section className="text-center space-y-4 py-6">
           <h2 className="text-3xl md:text-4xl font-black text-teal-800">
             صانع القصص المصورة
           </h2>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             نستخدم الذكاء الاصطناعي لرسم قصتك بأسلوب الأقلام الملونة الكلاسيكي، مع مراعاة الهوية والثقافة المغربية في كل التفاصيل.
           </p>
        </section>

        {/* Input Section */}
        <StoryInput onAnalyze={handleAnalyzeStory} isAnalyzing={isAnalyzing} />

        {/* Error Message */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
            {generalError}
          </div>
        )}

        {/* Results Grid */}
        {scenes.length > 0 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-2">
              <Palette className="text-teal-600" />
              <h3 className="text-2xl font-bold text-gray-800">لوحات القصة</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scenes.map((scene) => (
                <SceneCard 
                  key={scene.id} 
                  scene={scene} 
                  onRetry={handleRetryScene}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Simple footer pattern */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-[url('https://www.transparenttextures.com/patterns/moroccan.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default App;