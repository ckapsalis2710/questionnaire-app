import React, { useState, useEffect, useCallback } from 'react';
import Question from '../Question/Question';
import api from '../../services/api';
import './Questionnaire.css';

const Questionnaire = ({ onSaveStatusChange, onQuestionsChange }) => {
  const [questions, setQuestions] = useState([]);
  const devEnv = process.env.NODE_ENV === 'development';

  // with useCallback will not re-render
  const loadQuestions = useCallback(async () => {
    try {
      onSaveStatusChange('saving');
      const data = await api.getQuestions();
      setQuestions(data);
      onSaveStatusChange('saved');
    } catch (error) {
      console.error('Failed to load questions:', error);
      onSaveStatusChange('error');
    }
  }, [onSaveStatusChange]);

  const triggerAutoSave = useCallback(async (saveFunction) => {
    onSaveStatusChange('saving');

    const timeoutPromise = new Promise(resolve => 
      setTimeout(resolve, 400)
    );

    try {
      // add timeoutPromise to delay Saving state appearance
      await Promise.all([
        saveFunction(),
        timeoutPromise
      ]);
      onSaveStatusChange('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      onSaveStatusChange('error');
    }
  }, [onSaveStatusChange]);

  // Question operations
  const addQuestion = useCallback(async () => {
    if (questions.length >= 10) return;
    
    await triggerAutoSave(async () => {
      const newQuestion = await api.createQuestion('');
      const updatedQuestions = [...questions, { ...newQuestion, answers: [] }];

      if (devEnv) console.log(`Question added: "${newQuestion.text}" (id: ${newQuestion.id})`);
      setQuestions(updatedQuestions);
    });
  }, [questions, triggerAutoSave, devEnv]);

  const updateQuestion = useCallback(async (questionId, newText) => {
    await triggerAutoSave(async () => {
      const updatedQuestion = await api.updateQuestion(questionId, newText);
      setQuestions(prev => prev.map(q =>
        q.id === questionId ? updatedQuestion : q
      ));

      if (devEnv) console.log(`Question ${updatedQuestion.order_index} updated: "${updatedQuestion.text}"`);
    });
  }, [triggerAutoSave, devEnv]);

  const deleteQuestion = useCallback(async (questionId) => {
    await triggerAutoSave(async () => {
      await api.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (devEnv) console.log(`Question deleted (id: ${questionId})`);
    });
  }, [triggerAutoSave, devEnv]);

  const moveQuestion = useCallback(async (questionId, direction) => {
    const index = questions.findIndex(q => q.id === questionId);
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index values
    const question1 = newQuestions[index];
    const question2 = newQuestions[newIndex];
    const tempOrder = question1.order_index;
    
    await triggerAutoSave(async () => {
      // Update both questions in backend
      await api.reorderQuestion(question1.id, question2.order_index);
      await api.reorderQuestion(question2.id, tempOrder);
      
      // Swap in frontend
      [newQuestions[index], newQuestions[newIndex]] = [question2, question1];
      
      if (devEnv) console.log(`Questions reordered: "${question1.text}" and "${question2.text}"`);
      setQuestions(newQuestions);
    });
  }, [questions, triggerAutoSave, devEnv]);

  // Answer operations
  const addAnswer = useCallback(async (questionId, initialText = '') => {
    await triggerAutoSave(async () => {
      const newAnswer = await api.createAnswer(questionId, initialText);
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, newAnswer]
          };
        }
        return q;
      }));

      if (devEnv) console.log(`Answer added: "${newAnswer.text}" to Q_ID: ${questionId}`);
    });
  }, [triggerAutoSave, devEnv]);

  const updateAnswer = useCallback(async (questionId, answerId, newText) => {
    await triggerAutoSave(async () => {
      const updatedAnswer = await api.updateAnswer(answerId, newText);
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === updatedAnswer.id ? updatedAnswer : a
            )
          };
        }
        return q;
      }));
      if (devEnv) console.log(`Answer updated: "${updatedAnswer.text}" in Q_ID: ${questionId}`);
    });
  }, [triggerAutoSave, devEnv]);

  const deleteAnswer = useCallback(async (questionId, answerId) => {
    await triggerAutoSave(async () => {
      await api.deleteAnswer(answerId);
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.filter(a => a.id !== answerId)
          };
        }
        return q;
      }));

      if (devEnv) console.log(`Answer deleted from Q_ID: ${questionId} (answerId: ${answerId})`);
    });
  }, [triggerAutoSave, devEnv]);

  const moveAnswer = useCallback(async (questionId, answerId, direction) => {
    const question = questions.find(q => q.id === questionId);
    const index = question.answers.findIndex(a => a.id === answerId);
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === question.answers.length - 1) return;

    const newAnswers = [...question.answers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index values
    const answer1 = newAnswers[index];
    const answer2 = newAnswers[newIndex];
    const tempOrder = answer1.order_index;
    
    await triggerAutoSave(async () => {
      // Update both answers' order_index in backend
      await api.reorderAnswer(answer1.id, answer2.order_index);
      await api.reorderAnswer(answer2.id, tempOrder);
      
      // Swap in frontend
      [newAnswers[index], newAnswers[newIndex]] = [answer2, answer1];
      
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return { ...q, answers: newAnswers };
        }
        return q;
      }));

      if (devEnv) console.log(`Answers reordered: ${answer1.text} and ${answer2.text} in Q_ID: ${questionId}`);
    });
  }, [questions, triggerAutoSave, devEnv]);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]); // called only once, because defined with useCallback

  useEffect(() => {
    onQuestionsChange(questions.length > 0);
  }, [questions, onQuestionsChange]);

  return (
    <div className="questionnaire-container">
      {questions.map((question, index) => (
        <Question
          key={question.id}
          question={question}
          index={index}
          totalQuestions={questions.length}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          onMoveUp={() => moveQuestion(question.id, 'up')}
          onMoveDown={() => moveQuestion(question.id, 'down')}
          onAddAnswer={addAnswer}
          onUpdateAnswer={updateAnswer}
          onDeleteAnswer={deleteAnswer}
          onMoveAnswer={moveAnswer}
        />
      ))}

      {questions.length < 10 && (
        <button className="add-question-button" onClick={addQuestion}>
          Add new question
        </button>
      )}
    </div>
  );
};

export default Questionnaire;