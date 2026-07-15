'use client';

import React from 'react';

import { useState, useCallback } from 'react';
import { CheckCircle, XCircle, RotateCcw, Lightbulb, Trophy, AlertCircle } from 'lucide-react';
import type { MCQQuestion, QuizAnswerState, QuizProps } from '@/types/content';

export function QuizEngine({ title = 'Knowledge Check', questions: questionsProp }: QuizProps) {
  // Defensive guard: during SSG, props may arrive as undefined
  const questions: MCQQuestion[] = Array.isArray(questionsProp) ? questionsProp : [];
  const [answers, setAnswers] = useState<Record<string, QuizAnswerState>>(() =>
    Object.fromEntries(
      questions.map((q) => [q.id, { selectedIndex: null, submitted: false }])
    )
  );
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const allAnswered = questions.every((q) => answers[q.id]?.selectedIndex !== null);

  const score = submitted
    ? questions.filter((q) => answers[q.id]?.selectedIndex === q.correctAnswerIndex).length
    : 0;

  const percentage = submitted ? Math.round((score / questions.length) * 100) : 0;

  const handleSelect = useCallback(
    (questionId: string, optionIndex: number) => {
      if (submitted) return;
      setAnswers((prev) => ({
        ...prev,
        [questionId]: { selectedIndex: optionIndex, submitted: false },
      }));
    },
    [submitted]
  );

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowHint({});
    setAnswers(
      Object.fromEntries(
        questions.map((q) => [q.id, { selectedIndex: null, submitted: false }])
      )
    );
  };

  const toggleHint = (qId: string) =>
    setShowHint((prev) => ({ ...prev, [qId]: !prev[qId] }));

  const getScoreEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '📚';
    return '💪';
  };

  const getScoreMessage = () => {
    if (percentage === 100) return 'Perfect score! Outstanding!';
    if (percentage >= 80) return 'Excellent work! Almost there!';
    if (percentage >= 60) return 'Good job! Keep practicing!';
    if (percentage >= 40) return 'Not bad! Review the explanations.';
    return 'Keep studying — you\'ve got this!';
  };

  return (
    <div
      className="rounded-2xl overflow-hidden my-8"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
      role="region"
      aria-label={`Quiz: ${title}`}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-muted)' }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, #6366f1 15%, transparent)', color: '#6366f1' }}
        >
          <Trophy size={18} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-bold text-base m-0" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-xs m-0" style={{ color: 'var(--text-muted)' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''} · Select one answer per question
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="p-6 space-y-8">
        {questions.map((question, qIdx) => {
          const state = answers[question.id];
          const isCorrect = submitted && state.selectedIndex === question.correctAnswerIndex;
          const isIncorrect = submitted && state.selectedIndex !== null && state.selectedIndex !== question.correctAnswerIndex;

          return (
            <div key={question.id} className="animate-fade-in" role="group" aria-labelledby={`q-${question.id}-label`}>
              {/* Question text */}
              <p
                id={`q-${question.id}-label`}
                className="font-semibold text-sm mb-3 flex items-start gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: 'var(--color-brand-500)', color: '#fff' }}
                  aria-hidden="true"
                >
                  {qIdx + 1}
                </span>
                {question.question}
              </p>

              {/* Options */}
              <div className="space-y-2 ml-8" role="radiogroup" aria-labelledby={`q-${question.id}-label`}>
                {question.options.map((option, optIdx) => {
                  const isSelected = state.selectedIndex === optIdx;
                  const isCorrectOption = submitted && optIdx === question.correctAnswerIndex;
                  const isWrongSelected = submitted && isSelected && !isCorrectOption;

                  return (
                    <button
                      key={optIdx}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelect(question.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
                        isCorrectOption
                          ? 'quiz-option-correct'
                          : isWrongSelected
                          ? 'quiz-option-incorrect'
                          : isSelected
                          ? 'quiz-option-selected'
                          : ''
                      }`}
                      style={{
                        borderColor: isCorrectOption || isWrongSelected || isSelected
                          ? undefined
                          : 'var(--border)',
                        background: isCorrectOption || isWrongSelected || isSelected
                          ? undefined
                          : 'var(--bg-elevated)',
                        color: isCorrectOption || isWrongSelected || isSelected
                          ? undefined
                          : 'var(--text-secondary)',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      {/* Option indicator */}
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          borderColor: isCorrectOption
                            ? 'rgb(34,197,94)'
                            : isWrongSelected
                            ? 'rgb(239,68,68)'
                            : isSelected
                            ? 'var(--color-brand-500)'
                            : 'var(--border-strong)',
                          color: isCorrectOption
                            ? 'rgb(34,197,94)'
                            : isWrongSelected
                            ? 'rgb(239,68,68)'
                            : isSelected
                            ? 'var(--color-brand-500)'
                            : 'var(--text-muted)',
                        }}
                        aria-hidden="true"
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {submitted && isCorrectOption && (
                        <CheckCircle size={16} className="flex-shrink-0" style={{ color: 'rgb(34,197,94)' }} aria-hidden="true" />
                      )}
                      {submitted && isWrongSelected && (
                        <XCircle size={16} className="flex-shrink-0" style={{ color: 'rgb(239,68,68)' }} aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint (before submit) */}
              {!submitted && question.hint && (
                <div className="ml-8 mt-2">
                  <button
                    onClick={() => toggleHint(question.id)}
                    className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                    aria-expanded={showHint[question.id]}
                    aria-controls={`hint-${question.id}`}
                  >
                    <Lightbulb size={12} />
                    {showHint[question.id] ? 'Hide hint' : 'Show hint'}
                  </button>
                  {showHint[question.id] && (
                    <p
                      id={`hint-${question.id}`}
                      className="text-xs mt-1.5 p-2.5 rounded-lg animate-fade-in"
                      style={{
                        background: 'color-mix(in srgb, #f59e0b 10%, transparent)',
                        color: '#92400e',
                        border: '1px solid color-mix(in srgb, #f59e0b 30%, transparent)',
                      }}
                    >
                      💡 {question.hint}
                    </p>
                  )}
                </div>
              )}

              {/* Explanation (after submit) */}
              {submitted && (
                <div
                  className="ml-8 mt-3 p-3 rounded-xl text-sm animate-fade-in"
                  style={{
                    background: isCorrect
                      ? 'rgba(34,197,94,0.08)'
                      : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: 'var(--text-secondary)',
                  }}
                  role="status"
                >
                  <strong style={{ color: isCorrect ? 'rgb(21,128,61)' : 'rgb(185,28,28)' }}>
                    {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                  </strong>
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: Submit / Score / Reset */}
      <div
        className="px-6 py-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-muted)' }}
      >
        {!submitted ? (
          <div className="flex items-center justify-between gap-4">
            {!allAnswered && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <AlertCircle size={12} />
                Answer all questions to submit
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="ml-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
              style={{
                background: allAnswered ? 'var(--color-brand-500)' : 'var(--bg-muted)',
                color: allAnswered ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${allAnswered ? 'transparent' : 'var(--border)'}`,
                opacity: allAnswered ? 1 : 0.6,
                cursor: allAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Score Banner */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: percentage >= 60
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
                border: `1px solid ${percentage >= 60 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}
              role="status"
              aria-live="polite"
            >
              <span className="text-2xl" aria-hidden="true">{getScoreEmoji()}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  You scored {score} out of {questions.length} — {percentage}% accuracy
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getScoreMessage()}</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <RotateCcw size={14} />
              Reset Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
