import React, { useEffect } from 'react';
import { Word } from '../types/vocabulary';

interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  autoFlip?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, isFlipped, onFlip, autoFlip }) => {
  useEffect(() => {
    if (autoFlip && !isFlipped) {
      const timer = setTimeout(() => {
        onFlip();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [word, autoFlip, isFlipped, onFlip]);

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'difficulty-badge beginner';
      case 'intermediate': return 'difficulty-badge intermediate';
      case 'advanced': return 'difficulty-badge advanced';
      default: return 'difficulty-badge';
    }
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
        <div className="flashcard-front">
          <div className="chinese-char">{word.chinese}</div>
          {word.pinyin && <div className="pinyin">{word.pinyin}</div>}
          <div className="frequency-badge">Частота: {word.frequency}</div>
        </div>
        <div className="flashcard-back">
          <div className="translation">{word.translation}</div>
          <div className="chinese-char">{word.chinese}</div>
          <div className={getDifficultyClass(word.difficulty)}>
            {word.difficulty === 'beginner' ? 'Начальный' :
             word.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;