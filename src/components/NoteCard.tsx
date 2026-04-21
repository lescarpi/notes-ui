import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { NoteResponse } from '../api';

interface NoteCardProps {
  note: NoteResponse;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => Promise<void>;
}

export function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const extractText = (content: any) => {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object' && 'text' in content) return content.text;
    return JSON.stringify(content);
  };

  const initialText = extractText(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return format(parseISO(note.createdAt), "MMM dd, yyyy • HH:mm");
    } catch {
      return 'Unknown date';
    }
  }, [note.createdAt]);

  const handleSave = async () => {
    if (!editValue.trim() || editValue === initialText) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await onUpdate(note.id, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditValue(initialText);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all hover:bg-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {!isEditing && !showDeleteConfirm && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-400/10"
            title="Edit note"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-400/10"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {showDeleteConfirm ? (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-3 font-medium">
            <AlertTriangle size={18} />
            <span>Excluir nota?</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(note.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Sim, excluir
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="mb-4">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full bg-slate-900/50 border border-indigo-500/50 rounded-xl outline-none resize-none px-4 py-3 text-slate-200 placeholder:text-slate-500 min-h-[100px]"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              title="Cancel"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !editValue.trim()}
              className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              title="Save"
            >
              <Check size={18} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap mb-4">
          {initialText}
        </p>
      )}

      <div className="text-xs text-slate-500 font-medium">
        {formattedDate} {isEditing && " (editing)"}
      </div>
    </div>
  );
}
