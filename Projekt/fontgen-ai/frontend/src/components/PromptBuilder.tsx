import { useState } from 'react';
import { DesignTokens } from '../services/api';

interface PromptBuilderProps {
  onPromptChange: (prompt: string, tokens: DesignTokens) => void;
  isLoading?: boolean;
}

type TokenValue = DesignTokens[keyof DesignTokens];

const DESIGN_TOKENS = {
  weight: [
    { label: 'Light', value: 'light', icon: '⎔' },
    { label: 'Regular', value: 'regular', icon: '█' },
    { label: 'Bold', value: 'bold', icon: '█▓' }
  ] as Array<{ label: string; value: 'light' | 'regular' | 'bold'; icon: string }>,
  contrast: [
    { label: 'Low', value: 'low', icon: '◐' },
    { label: 'Medium', value: 'medium', icon: '◑' },
    { label: 'High', value: 'high', icon: '●' }
  ] as Array<{ label: string; value: 'low' | 'medium' | 'high'; icon: string }>,
  style: [
    { label: 'Sans', value: 'sans', icon: '⊥' },
    { label: 'Mono', value: 'mono', icon: '|' }
  ] as Array<{ label: string; value: 'sans' | 'mono'; icon: string }>,
  mood: [
    { label: 'Elegant', value: 'elegant', icon: '✧' },
    { label: 'Playful', value: 'playful', icon: '◡' },
    { label: 'Technical', value: 'technical', icon: '⚙' }
  ] as Array<{ label: string; value: 'elegant' | 'playful' | 'technical'; icon: string }>
};

export function PromptBuilder({ onPromptChange, isLoading = false }: PromptBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [tokens, setTokens] = useState<DesignTokens>({
    weight: 'regular',
    contrast: 'medium',
    style: 'sans',
    mood: 'elegant'
  });

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    onPromptChange(newPrompt, tokens);
  };

  const handleTokenChange = (key: keyof DesignTokens, value: TokenValue) => {
    const newTokens = { ...tokens, [key]: value };
    setTokens(newTokens);
    onPromptChange(prompt, newTokens);
  };

  const handleQuickTemplate = (template: string) => {
    handlePromptChange(template);
  };

  const QUICK_TEMPLATES = [
    'Modern geometric sans-serif',
    'Elegant high-contrast sans',
    'Playful rounded sans',
    'Technical monospace typeface',
    'Sophisticated display font',
    'Futuristic minimal letterforms'
  ];

  return (
    <div className="space-y-6">
      {/* Prompt Input Section */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-neutral-600">
          Describe Your Font
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="e.g., 'A friendly sans-serif with rounded terminals and generous spacing for children's books'"
          disabled={isLoading}
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none transition-all"
        />
        <p className="text-xs text-neutral-500">
          {prompt.length}/500 characters · Be specific about style, mood, and intended use
        </p>
      </div>

      {/* Quick Templates */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Quick Start</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_TEMPLATES.map((template) => (
            <button
              key={template}
              onClick={() => handleQuickTemplate(template)}
              disabled={isLoading}
              className="text-left px-3 py-2 text-sm bg-neutral-100 hover:bg-primary-200 disabled:bg-neutral-200 disabled:text-neutral-400 text-neutral-700 rounded-md transition-colors truncate"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Design Tokens */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2">Weight</p>
          <div className="grid grid-cols-3 gap-2">
            {DESIGN_TOKENS.weight.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTokenChange('weight', opt.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  tokens.weight === opt.value
                    ? 'bg-primary-300 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'
                }`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2">Contrast</p>
          <div className="grid grid-cols-3 gap-2">
            {DESIGN_TOKENS.contrast.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTokenChange('contrast', opt.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  tokens.contrast === opt.value
                    ? 'bg-primary-300 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'
                }`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2">Style</p>
          <div className="grid grid-cols-3 gap-2">
            {DESIGN_TOKENS.style.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTokenChange('style', opt.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  tokens.style === opt.value
                    ? 'bg-primary-300 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'
                }`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2">Mood</p>
          <div className="grid grid-cols-3 gap-2">
            {DESIGN_TOKENS.mood.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTokenChange('mood', opt.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  tokens.mood === opt.value
                    ? 'bg-primary-300 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'
                }`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary-100/30 border border-primary-200 rounded-md p-3">
        <p className="text-sm text-neutral-700">
          <span className="font-medium">Your Selection:</span>
          <br />
          <span className="text-sm text-neutral-600">
            {tokens.weight} {tokens.style} with {tokens.contrast} contrast, {tokens.mood} mood
          </span>
        </p>
      </div>
    </div>
  );
}
