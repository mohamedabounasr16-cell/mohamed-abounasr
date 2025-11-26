export interface Scene {
  id: number;
  narrative_segment: string; // The part of the story in Arabic
  visual_prompt: string; // The detailed prompt for the image generator (English)
  characters: string; // Brief description of characters in this scene to maintain consistency
  imageUrl?: string;
  isLoading: boolean;
  error?: string;
}

export interface StoryAnalysisResponse {
  scenes: {
    narrative_segment: string;
    visual_prompt: string;
    characters: string;
  }[];
}