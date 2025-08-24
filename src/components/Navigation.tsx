import React from 'react';
import { ViewMode } from '../types/vocabulary';

interface NavigationProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  const modes: { value: ViewMode; label: string; icon: string }[] = [
    { value: 'study', label: 'Изучение', icon: '📖' },
    { value: 'practice', label: 'Практика', icon: '🎯' },
    { value: 'test', label: 'Тест', icon: '📝' },
    { value: 'stats', label: 'Статистика', icon: '📊' }
  ];

  return (
    <div className="nav-tabs">
      {modes.map(mode => (
        <button
          key={mode.value}
          className={`nav-tab ${currentMode === mode.value ? 'active' : ''}`}
          onClick={() => onModeChange(mode.value)}
        >
          {mode.icon} {mode.label}
        </button>
      ))}
    </div>
  );
};

export default Navigation;