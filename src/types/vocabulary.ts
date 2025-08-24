export interface Word {
  chinese: string;
  pinyin?: string;
  translation: string;
  frequency: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'verb' | 'noun' | 'adjective' | 'pronoun' | 'adverb' | 'particle' | 'preposition' | 'conjunction' | 'measure';
}

export interface Vocabulary {
  total_words: number;
  words: Word[];
}

export interface StudyProgress {
  [wordId: string]: {
    known: boolean;
    lastStudied: Date;
    timesStudied: number;
    timesCorrect: number;
    timesIncorrect: number;
  };
}

export interface TestResult {
  word: Word;
  correct: boolean;
  userAnswer: string;
  timestamp: Date;
}

export type ViewMode = 'study' | 'practice' | 'test' | 'stats';

export interface FilterSettings {
  category: string;
  difficulty: string;
  showKnown: boolean;
  showUnknown: boolean;
}