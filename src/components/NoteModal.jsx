import { useState } from 'react';

export default function NoteModal({ isOpen, onClose, problemKey, note, onSave }) {
  const [text, setText] = useState(note || '');

  if (!isOpen) return null;

  function handleSave() {
    onSave(problemKey, text);
    onClose();
  }

  const problemName = problemKey ? problemKey.split('::')[1] : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, rgba(24,24,27,0.98), rgba(15,15,17,0.99))',
          border: '1px solid rgba(212,175,55,0.12)',
          borderRadius: '16px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.05)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Notes</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-silver-600 hover:text-white transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-silver-600 mb-5 truncate tracking-wide">{problemName}</p>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Approach, time complexity, key insights..."
            className="w-full h-40 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-sm text-silver-200 placeholder-silver-700 resize-none focus:outline-none focus:border-gold-500/25 transition-all duration-300 font-body tracking-wide leading-relaxed"
            autoFocus
            id="note-textarea"
          />

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[12px] text-silver-500 hover:text-white hover:bg-white/[0.04] transition-all tracking-wide"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-[12px] font-semibold tracking-wider transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #b8941f, #d4af37)',
                color: '#09090b',
                boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
              }}
              id="save-note-btn"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
