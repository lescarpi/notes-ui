export interface NoteResponse {
  id: string;
  content: any;
  createdAt: string;
}

const API_URL = 'http://localhost:8080';

export const api = {
  getNotes: async (page = 0, size = 50): Promise<NoteResponse[]> => {
    const res = await fetch(`${API_URL}/note?page=${page}&size=${size}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },
  createNote: async (text: string): Promise<NoteResponse> => {
    // Send as an object since it's a JsonNode on the backend
    const res = await fetch(`${API_URL}/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { text } }),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },
  updateNote: async (id: string, text: string): Promise<NoteResponse> => {
    const res = await fetch(`${API_URL}/note/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { text } }),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },
  deleteNote: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/note/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
  }
};
