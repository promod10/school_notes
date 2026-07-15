'use client';

import { QuizEngine } from './QuizEngine';
import type { MCQQuestion } from '@/types/content';

interface QuizLoaderProps {
  title?: string;
  // Questions are passed as a JSON string to avoid RSC serialization issues
  questionsJson: string;
}

/**
 * QuizLoader — bridges the Server Component MDX boundary to the Client QuizEngine.
 * 
 * Usage in MDX:
 * <QuizLoader title="My Quiz" questionsJson='[{"id":"q1","question":"..."}]' />
 * 
 * This avoids the next-mdx-remote RSC serialization problem where complex
 * inline array props (questions={[...]}) don't pass through correctly.
 */
export function QuizLoader({ title, questionsJson }: QuizLoaderProps) {
  let questions: MCQQuestion[] = [];

  try {
    questions = JSON.parse(questionsJson) as MCQQuestion[];
  } catch {
    console.error('[QuizLoader] Failed to parse questionsJson:', questionsJson?.slice(0, 100));
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl p-6 text-sm my-6" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        ⚠️ Quiz could not be loaded. Please check the questionsJson prop.
      </div>
    );
  }

  return <QuizEngine title={title} questions={questions} />;
}
