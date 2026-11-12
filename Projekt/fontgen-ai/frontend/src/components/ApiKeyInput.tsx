import { useState } from 'react';
import { isValidApiKey, detectProvider, API_PROVIDERS, ApiProvider } from '../services/api';
import { DEFAULT_MODELS } from '../lib/llm';
import { Disclosure } from './Disclosure';

export interface ApiKeySubmit {
  apiKey: string;
  provider: ApiProvider;
  model: string;
  remember: boolean;
}

interface ApiKeyInputProps {
  onSubmit: (value: ApiKeySubmit) => void;
  onClose: () => void;
}

export function ApiKeyInput({ onSubmit, onClose }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [model, setModel] = useState('');
  const [remember, setRemember] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidApiKey(apiKey, provider)) {
      setError(`That does not look like a ${API_PROVIDERS[provider].label} key (it starts with ${API_PROVIDERS[provider].placeholder})`);
      return;
    }
    onSubmit({ apiKey: apiKey.trim(), provider, model: model.trim(), remember });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Connect your AI key"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full my-auto">
        <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">Connect your AI</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Paste your own API key to let AI design fonts for you. The key stays in this browser and goes only to the AI provider.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-800 text-2xl leading-none w-11 h-11 -mr-3 -mt-2 shrink-0">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-neutral-600 mb-1">API key</span>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                autoComplete="off"
                autoFocus
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                  const detected = detectProvider(e.target.value);
                  if (detected) setProvider(detected);
                }}
                placeholder="Paste your key here"
                className="w-full px-3 py-2.5 pr-16 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 text-neutral-500 hover:text-neutral-800 text-sm font-medium"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <span className="block text-xs text-neutral-400 mt-1">
              Detected provider: <span className="font-medium text-neutral-600">{API_PROVIDERS[provider].label}</span>
            </span>
          </label>

          <label className="flex items-center gap-3 min-h-[44px] text-sm text-neutral-600 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-5 h-5 accent-primary-300" />
            Remember the key on this device
          </label>

          <Disclosure title="Other provider or model" titleClassName="text-neutral-600">
            <div className="space-y-3">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ApiProvider)}
                aria-label="Provider"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md bg-white"
              >
                {(Object.keys(API_PROVIDERS) as ApiProvider[]).map((p) => (
                  <option key={p} value={p}>{API_PROVIDERS[p].label}</option>
                ))}
              </select>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={DEFAULT_MODELS[provider]}
                aria-label="Model"
                autoComplete="off"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md"
              />
            </div>
          </Disclosure>

          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
            Use a key with a spending limit. Browser extensions and other people using this browser profile could read a saved key.
          </p>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="w-full bg-primary-300 hover:bg-primary-400 text-white font-medium py-3 px-4 rounded-md transition-colors">
            Save and continue
          </button>
        </form>
      </div>
    </div>
  );
}
