import React, { useState, useEffect } from 'react';
import { Vocabulary, StudyProgress, Word } from '../types/vocabulary';

interface PracticeModeProps {
  vocabulary: Vocabulary;
  studyProgress: StudyProgress;
  onUpdateProgress: (word: Word, known: boolean) => void;
}

interface PracticeItem {
  word: Word;
  matched: boolean;
  id: string;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ vocabulary, studyProgress, onUpdateProgress }) => {
  const [practiceCount, setPracticeCount] = useState(20);
  const [practiceWords, setPracticeWords] = useState<PracticeItem[]>([]);
  const [englishWords, setEnglishWords] = useState<PracticeItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<PracticeItem | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const startPractice = () => {
    const shuffled = [...vocabulary.words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(practiceCount, vocabulary.words.length));
    
    const chinese = selected.map((word, index) => ({
      word,
      matched: false,
      id: `chinese-${index}`
    }));
    
    const english = selected
      .map((word, index) => ({
        word,
        matched: false,
        id: `english-${index}`
      }))
      .sort(() => Math.random() - 0.5);
    
    setPracticeWords(chinese);
    setEnglishWords(english);
    setMatchedCount(0);
    setIsStarted(true);
  };

  const handleDragStart = (item: PracticeItem, e: React.DragEvent) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetItem: PracticeItem, e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    if (draggedItem.word.chinese === targetItem.word.chinese) {
      // Correct match
      setPracticeWords(prev => prev.map(item => 
        item.word.chinese === targetItem.word.chinese 
          ? { ...item, matched: true }
          : item
      ));
      setEnglishWords(prev => prev.map(item => 
        item.word.chinese === draggedItem.word.chinese 
          ? { ...item, matched: true }
          : item
      ));
      setMatchedCount(prev => prev + 1);
      onUpdateProgress(draggedItem.word, true);
    }
    
    setDraggedItem(null);
  };

  const resetPractice = () => {
    setIsStarted(false);
    setPracticeWords([]);
    setEnglishWords([]);
    setMatchedCount(0);
  };

  if (!isStarted) {
    return (
      <div className="practice-mode">
        <div className="study-controls">
          <div className="control-group">
            <label>Количество слов:</label>
            <select 
              value={practiceCount} 
              onChange={(e) => setPracticeCount(Number(e.target.value))}
            >
              <option value="10">10 слов</option>
              <option value="20">20 слов</option>
              <option value="30">30 слов</option>
              <option value="50">50 слов</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={startPractice}>
            Начать практику
          </button>
        </div>
      </div>
    );
  }

  const progress = practiceWords.length > 0 ? (matchedCount / practiceWords.length) * 100 : 0;

  return (
    <div className="practice-mode">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            {matchedCount} / {practiceWords.length}
          </div>
        </div>
      </div>

      {matchedCount === practiceWords.length && practiceWords.length > 0 && (
        <div className="practice-complete">
          <h2>🎉 Отлично! Все слова сопоставлены!</h2>
          <button className="btn btn-primary" onClick={resetPractice}>
            Новая практика
          </button>
        </div>
      )}

      <div className="practice-container">
        <div className="practice-section">
          <div className="section-title">English Words</div>
          <div className="words-list">
            {englishWords.filter(item => !item.matched).map(item => (
              <div
                key={item.id}
                className="draggable"
                draggable
                onDragStart={(e) => handleDragStart(item, e)}
              >
                {item.word.translation}
              </div>
            ))}
          </div>
        </div>
        
        <div className="practice-section">
          <div className="section-title">中文词汇</div>
          <div className="words-list">
            {practiceWords.map(item => (
              <div
                key={item.id}
                className={`droppable ${item.matched ? 'correct' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(item, e)}
              >
                {item.word.chinese}
                {item.matched && ` - ${item.word.translation}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-navigation">
        <button className="btn btn-secondary" onClick={resetPractice}>
          Сбросить практику
        </button>
      </div>
    </div>
  );
};

export default PracticeMode;