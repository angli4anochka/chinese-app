import React, { useState } from 'react';
import { Vocabulary, StudyProgress, Word } from '../types/vocabulary';

interface TestModeProps {
  vocabulary: Vocabulary;
  studyProgress: StudyProgress;
  onUpdateProgress: (word: Word, known: boolean) => void;
}

interface TestQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

const TestMode: React.FC<TestModeProps> = ({ vocabulary, studyProgress, onUpdateProgress }) => {
  const [testCount, setTestCount] = useState(20);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  const generateQuestions = (count: number): TestQuestion[] => {
    const shuffled = [...vocabulary.words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, vocabulary.words.length));
    
    return selected.map(word => {
      const correctAnswer = word.translation;
      const wrongAnswers = vocabulary.words
        .filter(w => w.chinese !== word.chinese)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.translation);
      
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        word,
        options,
        correctAnswer
      };
    });
  };

  const startTest = () => {
    const newQuestions = generateQuestions(testCount);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsStarted(true);
    setTestComplete(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestion) {
      onUpdateProgress(currentQuestion.word, isCorrect);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTestComplete(true);
    }
  };

  const resetTest = () => {
    setIsStarted(false);
    setTestComplete(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!isStarted) {
    return (
      <div className="test-mode">
        <div className="study-controls">
          <div className="control-group">
            <label>Количество вопросов:</label>
            <select 
              value={testCount} 
              onChange={(e) => setTestCount(Number(e.target.value))}
            >
              <option value="10">10 вопросов</option>
              <option value="20">20 вопросов</option>
              <option value="30">30 вопросов</option>
              <option value="50">50 вопросов</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={startTest}>
            Начать тест
          </button>
        </div>
      </div>
    );
  }

  if (testComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="test-mode">
        <div className="test-complete">
          <h2>Тест завершен!</h2>
          <div className="test-score">
            <div className="score-value">{score} / {questions.length}</div>
            <div className="score-percentage">{percentage}%</div>
          </div>
          <div className="test-feedback">
            {percentage >= 80 ? '🎉 Отличный результат!' :
             percentage >= 60 ? '👍 Хороший результат!' :
             percentage >= 40 ? '📚 Продолжайте изучать!' :
             '💪 Нужно больше практики!'}
          </div>
          <button className="btn btn-primary" onClick={resetTest}>
            Новый тест
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="test-mode">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          >
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      <div className="test-question">
        <div className="question-text">
          {currentQuestion.word.chinese}
        </div>
        
        <div className="answer-options">
          {currentQuestion.options.map((option, index) => {
            let className = 'answer-option';
            if (showResult) {
              if (option === currentQuestion.correctAnswer) {
                className += ' correct';
              } else if (option === selectedAnswer) {
                className += ' wrong';
              }
            } else if (option === selectedAnswer) {
              className += ' selected';
            }
            
            return (
              <div
                key={index}
                className={className}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="card-navigation">
          <button className="btn btn-primary" onClick={nextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestMode;