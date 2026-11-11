import { useState } from 'react';
import { isValidApiKey, detectProvider, API_PROVIDERS, ApiProvider } from '../services/api';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string, provider: ApiProvider) => void;
  isLoading?: boolean;
}

export function ApiKeyInput({ onSubmit, isLoading = false }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [showKey, setShowKey] = useState(false);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consented) {
      setError('You must acknowledge the security warning');
      return;
    }

    if (!isValidApiKey(apiKey, provider)) {
      setError(`Please enter a valid ${API_PROVIDERS[provider].label} key (${API_PROVIDERS[provider].placeholder})`);
      return;
    }

    onSubmit(apiKey.trim(), provider);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-700">API Configuration</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Configure your API key to start generating fonts
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Provider */}
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

          {/* API Key Input */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-600 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
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
              Gemini, OpenAI or Claude – the provider is detected from the key prefix
            </p>
          </div>

          {/* Security Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
            <div className="flex gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-amber-900">Security Warning</p>
                <p className="text-xs text-amber-800 mt-1">
                  Your API key will be:
                </p>
                <ul className="text-xs text-amber-800 mt-1 space-y-1 list-disc list-inside">
                  <li>Stored in browser sessionStorage (cleared on close)</li>
                  <li>Sent directly to the API with each request</li>
                  <li>Exposed to this website and browser extensions</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-amber-800 font-medium">
              Use a spend-limited or temporary API key only.
            </p>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              disabled={isLoading}
              className="mt-1 w-4 h-4 border border-neutral-300 rounded accent-primary-300 cursor-pointer"
            />
            <span className="text-sm text-neutral-600 flex-1">
              I understand the security implications and will use a spend-limited API key
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !consented}
            className="w-full bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ borderWidth: '2px', width: '16px', height: '16px' }} />
                Connecting...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg">
          <p className="text-xs text-neutral-500 text-center">
            Your key is never stored permanently and only used for this session.
          </p>
        </div>
      </div>
    </div>
  );
}
