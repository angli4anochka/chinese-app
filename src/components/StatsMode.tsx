import React, { useMemo } from 'react';
import { Vocabulary, StudyProgress } from '../types/vocabulary';

interface StatsModeProps {
  vocabulary: Vocabulary;
  studyProgress: StudyProgress;
  onResetProgress: () => void;
}

const StatsMode: React.FC<StatsModeProps> = ({ vocabulary, studyProgress, onResetProgress }) => {
  const stats = useMemo(() => {
    const totalWords = vocabulary.words.length;
    const studiedWords = Object.keys(studyProgress).length;
    const knownWords = Object.values(studyProgress).filter(p => p.known).length;
    const unknownWords = studiedWords - knownWords;
    
    const categoryStats: { [key: string]: { total: number; studied: number; known: number } } = {};
    
    vocabulary.words.forEach(word => {
      if (!categoryStats[word.category]) {
        categoryStats[word.category] = { total: 0, studied: 0, known: 0 };
      }
      categoryStats[word.category].total++;
      
      const progress = studyProgress[word.chinese];
      if (progress) {
        categoryStats[word.category].studied++;
        if (progress.known) {
          categoryStats[word.category].known++;
        }
      }
    });
    
    const totalCorrect = Object.values(studyProgress).reduce((sum, p) => sum + p.timesCorrect, 0);
    const totalIncorrect = Object.values(studyProgress).reduce((sum, p) => sum + p.timesIncorrect, 0);
    const accuracy = totalCorrect + totalIncorrect > 0 
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;
    
    return {
      totalWords,
      studiedWords,
      knownWords,
      unknownWords,
      categoryStats,
      accuracy,
      totalAttempts: totalCorrect + totalIncorrect
    };
  }, [vocabulary, studyProgress]);

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      verb: 'Глаголы',
      noun: 'Существительные',
      adjective: 'Прилагательные',
      pronoun: 'Местоимения',
      adverb: 'Наречия',
      particle: 'Частицы',
      preposition: 'Предлоги',
      conjunction: 'Союзы',
      measure: 'Счетные слова'
    };
    return labels[category] || category;
  };

  return (
    <div className="stats-mode">
      <h2>📊 Ваша статистика</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.studiedWords}</div>
          <div className="stat-label">Изучено слов</div>
          <div className="stat-detail">из {stats.totalWords}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.knownWords}</div>
          <div className="stat-label">Знаю</div>
          <div className="stat-detail">
            {stats.studiedWords > 0 
              ? `${Math.round((stats.knownWords / stats.studiedWords) * 100)}%`
              : '0%'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.unknownWords}</div>
          <div className="stat-label">Не знаю</div>
          <div className="stat-detail">
            {stats.studiedWords > 0 
              ? `${Math.round((stats.unknownWords / stats.studiedWords) * 100)}%`
              : '0%'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.accuracy}%</div>
          <div className="stat-label">Точность</div>
          <div className="stat-detail">{stats.totalAttempts} попыток</div>
        </div>
      </div>

      <div className="category-stats">
        <h3>Прогресс по категориям:</h3>
        {Object.entries(stats.categoryStats).map(([category, catStats]) => (
          <div key={category} className="category-stat-item">
            <div className="category-name">{getCategoryLabel(category)}</div>
            <div className="category-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${catStats.total > 0 ? (catStats.studied / catStats.total) * 100 : 0}%` 
                  }}
                >
                  {catStats.studied} / {catStats.total}
                </div>
              </div>
              <div className="category-detail">
                Знаю: {catStats.known} | Не знаю: {catStats.studied - catStats.known}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-actions">
        <button className="btn btn-danger" onClick={onResetProgress}>
          Сбросить прогресс
        </button>
      </div>
    </div>
  );
};

export default StatsMode;