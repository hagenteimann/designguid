import { useState } from 'react';
import { FontParams } from '../lib/engine/params';
import { LICENSE, Submission, cleanText, submissionUrl } from '../lib/library';

interface SaveDialogProps {
  params: FontParams;
  familyName: string;
  onClose: () => void;
}

export function SaveDialog({ params, familyName, onClose }: SaveDialogProps) {
  const [name, setName] = useState(familyName);
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [consent, setConsent] = useState(false);

  const cleanName = cleanText(name, 40);
  const valid = cleanName.length >= 2 && consent;

  const submission: Submission = {
    name: cleanName,
    author: cleanText(author, 40),
    description: cleanText(description, 200),
    license: LICENSE,
    consent: true,
    params
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Save to public library">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-700">Save to public library</h2>
            <p className="text-sm text-neutral-500 mt-1">Share this font so everyone can use it.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-700 text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-neutral-600 mb-1">Font name</span>
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-600 mb-1">Credit as <span className="font-normal text-neutral-400">(optional, public)</span></span>
            <input value={author} maxLength={40} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-600 mb-1">Short description <span className="font-normal text-neutral-400">(optional)</span></span>
            <textarea value={description} maxLength={200} rows={2} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
          </label>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-xs font-semibold text-amber-900">How publishing works</p>
            <ul className="text-xs text-amber-800 mt-1 space-y-1 list-disc list-inside">
              <li>A public GitHub issue is created under your GitHub account (a GitHub login is required)</li>
              <li>It contains only the font name, credit, description and design parameters</li>
              <li>The maintainer reviews it; approved fonts appear in the library within minutes</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-primary-300" />
            <span className="text-sm text-neutral-600 flex-1">
              I release this font under <a className="underline" href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0</a> (public domain): anyone may use it, also commercially, without attribution.
            </span>
          </label>

          <a
            href={valid ? submissionUrl(submission) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!valid}
            onClick={(e) => { if (!valid) e.preventDefault(); else setTimeout(onClose, 300); }}
            className={`block w-full text-center font-medium py-2 px-4 rounded-md transition-colors ${
              valid ? 'bg-primary-300 hover:bg-primary-400 text-white' : 'bg-neutral-300 text-white cursor-not-allowed'
            }`}
          >
            Continue on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
