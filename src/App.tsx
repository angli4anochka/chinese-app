import React, { useState, useEffect } from 'react';
import './App.css';
import { ViewMode, StudyProgress, Word } from './types/vocabulary';
import { defaultVocabulary } from './data/vocabulary';
import Navigation from './components/Navigation';
import StudyMode from './components/StudyMode';
import PracticeMode from './components/PracticeMode';
import TestMode from './components/TestMode';
import StatsMode from './components/StatsMode';

function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>('study');
  const [vocabulary] = useState(defaultVocabulary);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chineseProgress');
    if (saved) {
      try {
        setStudyProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('chineseProgress', JSON.stringify(studyProgress));
  }, [studyProgress]);

  const updateWordProgress = (word: Word, known: boolean) => {
    const key = word.chinese;
    const current = studyProgress[key] || {
      known: false,
      lastStudied: new Date(),
      timesStudied: 0,
      timesCorrect: 0,
      timesIncorrect: 0
    };

    setStudyProgress({
      ...studyProgress,
      [key]: {
        ...current,
        known,
        lastStudied: new Date(),
        timesStudied: current.timesStudied + 1,
        timesCorrect: known ? current.timesCorrect + 1 : current.timesCorrect,
        timesIncorrect: !known ? current.timesIncorrect + 1 : current.timesIncorrect
      }
    });
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setStudyProgress({});
      localStorage.removeItem('chineseProgress');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📚 Chinese Vocabulary Trainer</h1>
        
        <Navigation currentMode={currentMode} onModeChange={setCurrentMode} />
        
        <div className="mode-container">
          {currentMode === 'study' && (
            <StudyMode 
              vocabulary={vocabulary} 
              studyProgress={studyProgress}
              onUpdateProgress={updateWordProgress}
            />
          )}
          {currentMode === 'practice' && (
            <PracticeMode 
              vocabulary={vocabulary}
              studyProgress={studyProgress}
              onUpdateProgress={updateWordProgress}
            />
          )}
          {currentMode === 'test' && (
            <TestMode 
              vocabulary={vocabulary}
              studyProgress={studyProgress}
              onUpdateProgress={updateWordProgress}
            />
          )}
          {currentMode === 'stats' && (
            <StatsMode 
              vocabulary={vocabulary}
              studyProgress={studyProgress}
              onResetProgress={resetProgress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;