'use client';

import { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  // Raw HTML from Shiki server-side rendering
  __rawHtml?: string;
}

export function CodeBlock({ children, className, language, __rawHtml }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const lang = language ?? (className?.replace('language-', '') ?? 'text');

  const handleCopy = async () => {
    const text = codeRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / HTTP context
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang" aria-label={`Language: ${lang}`}>
          {lang}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
          title={copied ? 'Copied!' : 'Copy code'}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer"
          style={{
            background: copied ? 'rgba(34,197,94,0.15)' : 'var(--bg-elevated)',
            color: copied ? 'rgb(34,197,94)' : 'var(--text-muted)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
          }}
        >
          {copied ? (
            <>
              <Check size={12} strokeWidth={3} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {__rawHtml ? (
        // Shiki server-rendered HTML (injected as HTML string)
        <pre
          ref={codeRef}
          className="shiki"
          aria-label={`Code block in ${lang}`}
          dangerouslySetInnerHTML={{ __html: __rawHtml }}
        />
      ) : (
        <pre ref={codeRef} className={className} aria-label={`Code block in ${lang}`}>
          <code>{children}</code>
        </pre>
      )}
    </div>
  );
}
