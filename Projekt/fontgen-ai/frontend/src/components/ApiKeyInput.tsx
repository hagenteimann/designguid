import { useState } from 'react';
import { isValidApiKey, detectProvider, API_PROVIDERS, ApiProvider } from '../services/api';
import { DEFAULT_MODELS } from '../lib/llm';

export interface ApiKeySubmit {
  apiKey: string;
  provider: ApiProvider;
  model: string;
  remember: boolean;
}

interface ApiKeyInputProps {
  onSubmit: (value: ApiKeySubmit) => void;
  isLoading?: boolean;
  onSkip?: () => void;
}

export function ApiKeyInput({ onSubmit, isLoading = false, onSkip }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [model, setModel] = useState('');
  const [remember, setRemember] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consented) {
      setError('You must acknowledge the security notice');
      return;
    }

    if (!isValidApiKey(apiKey, provider)) {
      setError(`Please enter a valid ${API_PROVIDERS[provider].label} key (${API_PROVIDERS[provider].placeholder})`);
      return;
    }

    onSubmit({ apiKey: apiKey.trim(), provider, model: model.trim(), remember });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-700">API Configuration</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Use your own key. Everything runs in your browser – there is no server.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-neutral-600 mb-2">
              Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as ApiProvider)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white"
            >
              {(Object.keys(API_PROVIDERS) as ApiProvider[]).map((p) => (
                <option key={p} value={p}>{API_PROVIDERS[p].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-600 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                autoComplete="off"
                onChange={(e) => {
                  setApiKey(e.target.value);
                  const detected = detectProvider(e.target.value);
                  if (detected) setProvider(detected);
                }}
                placeholder={API_PROVIDERS[provider].placeholder}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              The provider is detected from the key prefix.
            </p>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-neutral-600 mb-2">
              Model <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              id="model"
              type="text"
              value={model}
              autoComplete="off"
              onChange={(e) => setModel(e.target.value)}
              placeholder={DEFAULT_MODELS[provider]}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              disabled={isLoading}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={isLoading}
              className="mt-1 w-4 h-4 border border-neutral-300 rounded accent-primary-300 cursor-pointer"
            />
            <span className="text-sm text-neutral-600 flex-1">
              Remember the key on this device (browser storage). Otherwise it is forgotten when you close the tab.
            </span>
          </label>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
            <p className="text-xs font-semibold text-amber-900">Security notice</p>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>Your key is sent only to the provider you picked, directly from your browser</li>
              <li>Nothing is sent to or stored on any server of this site</li>
              <li>Browser extensions and anyone using this browser profile can read it</li>
            </ul>
            <p className="text-xs text-amber-800 font-medium">
              Use a spend-limited or temporary key. Use “Forget key” on shared computers.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              disabled={isLoading}
              className="mt-1 w-4 h-4 border border-neutral-300 rounded accent-primary-300 cursor-pointer"
            />
            <span className="text-sm text-neutral-600 flex-1">
              I understand this and will use a spend-limited API key
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !consented}
            className="w-full bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Continue
          </button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-sm text-neutral-600 hover:text-neutral-900 underline"
            >
              Skip: use sliders and the library without AI
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
