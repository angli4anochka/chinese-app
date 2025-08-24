import React, { useState, useEffect } from 'react';
import { Vocabulary, StudyProgress, Word } from '../types/vocabulary';
import Flashcard from './Flashcard';

interface StudyModeProps {
  vocabulary: Vocabulary;
  studyProgress: StudyProgress;
  onUpdateProgress: (word: Word, known: boolean) => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ vocabulary, studyProgress, onUpdateProgress }) => {
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [autoFlip, setAutoFlip] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const filtered = vocabulary.words.filter(word => {
      if (categoryFilter !== 'all' && word.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && word.difficulty !== difficultyFilter) return false;
      return true;
    });
    setCurrentWords(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [vocabulary, categoryFilter, difficultyFilter]);

  const currentWord = currentWords[currentIndex];

  const handleNext = () => {
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkKnown = () => {
    if (currentWord) {
      onUpdateProgress(currentWord, true);
      handleNext();
    }
  };

  const handleMarkUnknown = () => {
    if (currentWord) {
      onUpdateProgress(currentWord, false);
      handleNext();
    }
  };

  const categories = ['all', 'verb', 'noun', 'adjective', 'pronoun', 'adverb', 'particle', 'preposition', 'conjunction', 'measure'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  if (!currentWord) {
    return <div className="no-words">Нет слов для изучения с выбранными фильтрами</div>;
  }

  return (
    <div className="study-mode">
      <div className="study-controls">
        <div className="control-group">
          <label>Категория:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Все категории' : cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Сложность:</label>
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'Все уровни' : 
                 diff === 'beginner' ? 'Начальный' :
                 diff === 'intermediate' ? 'Средний' : 'Продвинутый'}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={autoFlip}
              onChange={(e) => setAutoFlip(e.target.checked)}
            /> 
            Авто-переворот
          </label>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / currentWords.length) * 100}%` }}
          >
            {currentIndex + 1} / {currentWords.length}
          </div>
        </div>
      </div>

      <Flashcard 
        word={currentWord}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        autoFlip={autoFlip}
      />

      <div className="card-navigation">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Назад
        </button>
        <button className="btn btn-success" onClick={handleMarkKnown}>
          ✓ Знаю
        </button>
        <button className="btn btn-danger" onClick={handleMarkUnknown}>
          ✗ Не знаю
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={currentIndex === currentWords.length - 1}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};

export default StudyMode;