import { useEffect, useState } from 'react';
import { api, NoteResponse } from './api';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { Sparkles, Library } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getNotes();
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotes(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = async (text: string) => {
    const newNote = await api.createNote(text);
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = async (id: string) => {
    await api.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-4 justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
              <Library className="text-indigo-400" size={40} />
              Notes Hub
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Capture sua ideias instantaneamente.</p>
          </div>
        </header>

        <section className="mb-12">
          <NoteEditor onAddNote={handleAddNote} />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-400 font-medium px-1">
            <Sparkles size={18} className="text-purple-400" />
            <span>Notas Recentes</span>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-slate-800/50 h-32 rounded-2xl border border-slate-700/50"></div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
              <p className="text-slate-500 text-lg">Nenhuma nota ainda. Comece a escrever acima!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 items-start">
              {notes.map(note => (
                <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
