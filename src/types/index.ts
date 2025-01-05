export type BeverageType = 'wine' | 'whisky';

export interface MashBill {
  rye?: number;
  corn?: number;
  barley?: number;
  wheat?: number;
}

export interface TastingEntry {
  id: string;
  type: BeverageType;
  
  // Common fields
  name: string;
  imageBase64?: string;
  noseNotes: string;
  palateNotes: string;
  finishNotes: string;
  colorNotes: string;
  pairingSuggestions: string;
  
  // Scores
  aromaScore: number;
  palateScore: number;
  finishScore: number;
  overallScore: number;
  
  // Wine-specific
  vintage?: number;
  varietal?: string;
  region?: string;
  
  // Whisky-specific
  distillery?: string;
  ageStatement?: number;
  mashBill?: MashBill;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface TastingFormData extends Omit<TastingEntry, 'id' | 'overallScore' | 'createdAt' | 'updatedAt'> {} 