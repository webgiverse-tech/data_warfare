import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card'; // Using shadcn Card for blocks

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-4xl font-heading text-dw-accent-primary mb-6 mt-10" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-4 mt-8 border-b border-dw-background-glass pb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl font-subheading text-dw-text-primary mb-3 mt-6" {...props} />,
        p: ({ node, ...props }) => <p className="text-lg text-dw-text-secondary mb-4 leading-relaxed" {...props} />,
        a: ({ node, ...props }) => <a className="text-dw-accent-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside text-dw-text-secondary mb-4 pl-5 space-y-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-dw-text-secondary mb-4 pl-5 space-y-2" {...props} />,
        li: ({ node, ...props }) => <li className="text-dw-text-secondary" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-dw-text-primary" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-dw-text-secondary" {...props} />,
        code: ({ node, inline, ...props }) => (
          <code className={`font-mono text-sm ${inline ? 'bg-dw-background-glass px-1 py-0.5 rounded' : 'block bg-dw-background-glass p-3 rounded-md my-4 overflow-x-auto'}`} {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-dw-accent-primary pl-4 italic text-dw-text-secondary my-4" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="p-3 border-b border-dw-background-glass bg-dw-background-glass text-dw-text-primary font-subheading" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="p-3 border-b border-dw-background-glass text-dw-text-secondary" {...props} />
        ),
        hr: ({ node, ...props }) => <hr className="border-dw-background-glass my-8" {...props} />,
        // Custom component for the main report card
        wrapper: ({ children }) => (
          <Card className="bg-dw-background-glass border border-dw-accent-primary/30 shadow-lg shadow-dw-accent-primary/10 p-8 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dw-accent-primary/10 to-dw-accent-secondary/10 opacity-20 animate-pulse-slow"></div>
            <div className="relative z-10">
              {children}
            </div>
          </Card>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;