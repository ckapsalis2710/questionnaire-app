import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '../UI/Icon';
import './Answer.css';

const Answer = ({
  answer,
  index,
  totalAnswers,
  isNew = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAdd,
  showError = false
}) => {
  const [text, setText] = useState('');
  const [isDirty, setIsDirty] = useState(false); // flag for changed in question/answer input fields 

  // Update local state when answer prop changes
  useEffect(() => {
    if (answer) {
      setText(answer.text || '');
      setIsDirty(false); // Reset dirty flag when answer changes
    }
  }, [answer]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    setIsDirty(true); // we have smt new in the input field
  }, []);

  // Handle blur (focus out) or Enter key
  const handleBlur = useCallback(() => {
    // If this is an existing answer, validate on blur
    if (!isNew && isDirty && onUpdate) {
      onUpdate(text);
      setIsDirty(false);
    }
    
    // If this is the new answer input and it has content
    if (isNew && text.trim() && onAdd) {
      onAdd(text); // Add text to new answer
      setText(''); // Clear only after passing the text to parent
      setIsDirty(false);
    }
  }, [isNew, isDirty, onUpdate, onAdd, text]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  }, [handleBlur]);

   // useMemo for computed values
  const answerNumber = useMemo(() => 
    String(index + 1).padStart(2, '0'), 
    [index]
  );

  const hasError = useMemo(() => 
    showError && !isNew && (!text || !text.trim()),
    [showError, isNew, text]
  );

  const isFirst = useMemo(() => index === 0, [index]);
  const isLast = useMemo(() => index === totalAnswers - 1, [index, totalAnswers]);

  // If this is the "new answer" input (always at the bottom)
  if (isNew) {
    return (
      <div className="answer-item new-answer">
        <input
          type="text"
          className="answer-input new"
          placeholder="Type an answer..."
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
        />
      </div>
    );
  }

  // Regular answer with number, input, and controls
  return (
    <div className={`answer-item ${hasError ? 'error' : ''}`}>
      <div className="answer-content">
        <span className="answer-number">
          {answerNumber}
        </span>
        
        <input
          type="text"
          className={`answer-input ${hasError ? 'error' : ''}`}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
        />

        <div className="answer-actions">
          <button 
            className={`action-button small ${isFirst ? 'disabled' : ''}`}
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            <Icon name="up" />
          </button>
          <button 
            className={`action-button small ${isLast ? 'disabled' : ''}`}
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
          >
            <Icon name="down" />
          </button>
          <button 
            className="action-button small delete"
            onClick={onDelete}
            title="Delete answer"
          >
            <Icon name="trash" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Answer);