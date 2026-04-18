import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface NoteEditorProps {
  onAddNote: (text: string) => Promise<void>;
}

export function NoteEditor({ onAddNote }: NoteEditorProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddNote(text.trim());
      setText('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
      <div className="relative bg-slate-900 rounded-2xl p-2 flex gap-3 border border-slate-800 focus-within:border-indigo-500/50 transition-colors">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 text-slate-200 placeholder:text-slate-500 min-h-[60px] max-h-[200px]"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-end p-2">
          <button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl p-3 transition-all active:scale-95 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </form>
  );
}
