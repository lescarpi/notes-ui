import React from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { NoteResponse } from '../api';

interface NoteCardProps {
  note: NoteResponse;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const extractText = (content: any) => {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object' && 'text' in content) return content.text;
    return JSON.stringify(content);
  };

  const formattedDate = React.useMemo(() => {
    try {
      return format(parseISO(note.createdAt), "MMM dd, yyyy • HH:mm");
    } catch {
      return 'Unknown date';
    }
  }, [note.createdAt]);

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all hover:bg-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(note.id)}
          className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-400/10"
          title="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap mb-4">
        {extractText(note.content)}
      </p>
      <div className="text-xs text-slate-500 font-medium">
        {formattedDate}
      </div>
    </div>
  );
}
