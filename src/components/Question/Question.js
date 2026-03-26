import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Answer from '../Answer/Answer';
import Icon from '../UI/Icon';
import './Question.css';

const Question = ({
  question,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddAnswer,
  onUpdateAnswer,
  onDeleteAnswer,
  onMoveAnswer
}) => {
  const [showError, setShowError] = useState(false);
  const [localAnswers, setLocalAnswers] = useState(question.answers || []);
  const [localQuestionText, setLocalQuestionText] = useState(question.text || ''); // new local state gor question text
  const [isDirty, setIsDirty] = useState(false); // flag for changed in question/answer input fields 

// useMemo for computed values
  const hasQuestionError = useMemo(() => 
    showError && !localQuestionText.trim(), 
    [showError, localQuestionText]
  );

  const hasAnswersError = useMemo(() => 
    showError && localAnswers.some(a => !a.text || !a.text.trim()),
    [showError, localAnswers]
  );

  const isFirstQuestion = useMemo(() => index === 0, [index]);
  const isLastQuestion = useMemo(() => index === totalQuestions - 1, [index, totalQuestions]);

  const handleQuestionChange = useCallback((e) => {
    setLocalQuestionText(e.target.value);
    setIsDirty(true); // we have smt new in the input field
    setShowError(false);
  }, []);

  // Handle blur (focus out)
  const handleQuestionBlur = useCallback(() => {
    if (isDirty && onUpdate) {
      onUpdate(question.id, localQuestionText);
      setIsDirty(false);
    }
    
    if (!localQuestionText.trim()) {
      setShowError(true);
    }
  }, [isDirty, onUpdate, question.id, localQuestionText]);

    // Handle key press για Enter
  const handleQuestionKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuestionBlur();
    }
  }, [handleQuestionBlur]);

  // Handle answer update
  const handleAnswerUpdate = useCallback((answerId, newText) => {
    // Update local state immediately for UI responsiveness
    setLocalAnswers(prev => 
      prev.map(a => a.id === answerId ? { ...a, text: newText } : a)
    );
    
    // Update parent 
    onUpdateAnswer(question.id, answerId, newText);
    
    // Check if this answer is now empty and validate
    const isEmpty = !newText || !newText.trim();
    if (isEmpty) {
      setShowError(true);
    }
  }, [question.id, onUpdateAnswer]);

  // Sync local answers with props
  useEffect(() => {
    setLocalAnswers(question.answers || []);
  }, [question.answers]);

   // Sync local question text with props
  useEffect(() => {
    setLocalQuestionText(question.text || '');
    setIsDirty(false); // Reset dirty flag
  }, [question.text]);

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-title-section">
          <span className="question-number">Q{index + 1}</span>
          <input
            type="text"
            className={`question-input ${hasQuestionError ? 'error' : ''}`}
            placeholder="Type your question here…"
            value={localQuestionText}
            onChange={handleQuestionChange}
            onBlur={handleQuestionBlur}
            onKeyPress={handleQuestionKeyPress}
          />
        </div>

        <div className="question-actions">
          <button 
            className={`action-button ${isFirstQuestion ? 'disabled' : ''}`}
            onClick={onMoveUp}
            disabled={isFirstQuestion}
          >
            <Icon name="up" />
          </button>
          <button 
            className={`action-button ${isLastQuestion ? 'disabled' : ''}`}
            onClick={onMoveDown}
            disabled={isLastQuestion}
          >
            <Icon name="down" />
          </button>
          <button 
            className="action-button delete"
            onClick={() => onDelete(question.id)}
          >
            <Icon name="trash" />
          </button>
        </div>
      </div>

      {hasQuestionError && (
        <div className="question-error">
          Whoops! Please enter a question prompt to continue
        </div>
      )}

      <div className="answers-divider"></div>

      <div className="answers-section">
        {/* Render all existing answers */}
        {localAnswers.map((answer, ansIndex) => (
          <Answer
            key={answer.id}
            answer={answer}
            index={ansIndex}
            totalAnswers={localAnswers.length}
            onUpdate={(text) => handleAnswerUpdate(answer.id, text)}
            onDelete={() => onDeleteAnswer(question.id, answer.id)}
            onMoveUp={() => onMoveAnswer(question.id, answer.id, 'up')}
            onMoveDown={() => onMoveAnswer(question.id, answer.id, 'down')}
            showError={showError && (!answer.text || !answer.text.trim())}
          />
        ))}

        {/* Always show one empty input at the end for new answers */}
        <Answer
          isNew={true}
          onAdd={(text) => onAddAnswer(question.id, text)}
        />

        {/* Global error message for empty answers */}
        {hasAnswersError && (
          <div className="answers-error">
            Please fill out all answers
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Question);