import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const DESIGN_TOKENS = {
    weight: [
        { label: 'Light', value: 'light', icon: '⎔' },
        { label: 'Regular', value: 'regular', icon: '█' },
        { label: 'Bold', value: 'bold', icon: '█▓' }
    ],
    contrast: [
        { label: 'Low', value: 'low', icon: '◐' },
        { label: 'Medium', value: 'medium', icon: '◑' },
        { label: 'High', value: 'high', icon: '●' }
    ],
    style: [
        { label: 'Serif', value: 'serif', icon: 'Γ' },
        { label: 'Sans', value: 'sans', icon: '⊥' },
        { label: 'Mono', value: 'mono', icon: '|' }
    ],
    mood: [
        { label: 'Elegant', value: 'elegant', icon: '✧' },
        { label: 'Playful', value: 'playful', icon: '◡' },
        { label: 'Technical', value: 'technical', icon: '⚙' }
    ]
};
export function PromptBuilder({ onPromptChange, isLoading = false }) {
    const [prompt, setPrompt] = useState('');
    const [tokens, setTokens] = useState({
        weight: 'regular',
        contrast: 'medium',
        style: 'sans',
        mood: 'elegant'
    });
    const handlePromptChange = (newPrompt) => {
        setPrompt(newPrompt);
        onPromptChange(newPrompt, tokens);
    };
    const handleTokenChange = (key, value) => {
        const newTokens = { ...tokens, [key]: value };
        setTokens(newTokens);
        onPromptChange(prompt, newTokens);
    };
    const handleQuickTemplate = (template) => {
        handlePromptChange(template);
    };
    const QUICK_TEMPLATES = [
        'Modern geometric sans-serif',
        'Elegant serif with high contrast',
        'Playful rounded sans',
        'Technical monospace typeface',
        'Sophisticated display font',
        'Futuristic minimal letterforms'
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "prompt", className: "block text-sm font-medium text-neutral-600", children: "Describe Your Font" }), _jsx("textarea", { id: "prompt", value: prompt, onChange: (e) => handlePromptChange(e.target.value), placeholder: "e.g., 'A friendly sans-serif with rounded terminals and generous spacing for children's books'", disabled: isLoading, rows: 4, className: "w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none transition-all" }), _jsxs("p", { className: "text-xs text-neutral-500", children: [prompt.length, "/500 characters \u00B7 Be specific about style, mood, and intended use"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs font-medium text-neutral-600 uppercase tracking-wide", children: "Quick Start" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: QUICK_TEMPLATES.map((template) => (_jsx("button", { onClick: () => handleQuickTemplate(template), disabled: isLoading, className: "text-left px-3 py-2 text-sm bg-neutral-100 hover:bg-primary-200 disabled:bg-neutral-200 disabled:text-neutral-400 text-neutral-700 rounded-md transition-colors truncate", children: template }, template))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2", children: "Weight" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: DESIGN_TOKENS.weight.map((opt) => (_jsxs("button", { onClick: () => handleTokenChange('weight', opt.value), disabled: isLoading, className: `px-3 py-2 rounded-md text-sm font-medium transition-all ${tokens.weight === opt.value
                                        ? 'bg-primary-300 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'}`, children: [_jsx("span", { className: "mr-1", children: opt.icon }), opt.label] }, opt.value))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2", children: "Contrast" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: DESIGN_TOKENS.contrast.map((opt) => (_jsxs("button", { onClick: () => handleTokenChange('contrast', opt.value), disabled: isLoading, className: `px-3 py-2 rounded-md text-sm font-medium transition-all ${tokens.contrast === opt.value
                                        ? 'bg-primary-300 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'}`, children: [_jsx("span", { className: "mr-1", children: opt.icon }), opt.label] }, opt.value))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2", children: "Style" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: DESIGN_TOKENS.style.map((opt) => (_jsxs("button", { onClick: () => handleTokenChange('style', opt.value), disabled: isLoading, className: `px-3 py-2 rounded-md text-sm font-medium transition-all ${tokens.style === opt.value
                                        ? 'bg-primary-300 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'}`, children: [_jsx("span", { className: "mr-1", children: opt.icon }), opt.label] }, opt.value))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2", children: "Mood" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: DESIGN_TOKENS.mood.map((opt) => (_jsxs("button", { onClick: () => handleTokenChange('mood', opt.value), disabled: isLoading, className: `px-3 py-2 rounded-md text-sm font-medium transition-all ${tokens.mood === opt.value
                                        ? 'bg-primary-300 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'}`, children: [_jsx("span", { className: "mr-1", children: opt.icon }), opt.label] }, opt.value))) })] })] }), _jsx("div", { className: "bg-primary-100/30 border border-primary-200 rounded-md p-3", children: _jsxs("p", { className: "text-sm text-neutral-700", children: [_jsx("span", { className: "font-medium", children: "Your Selection:" }), _jsx("br", {}), _jsxs("span", { className: "text-sm text-neutral-600", children: [tokens.weight, " ", tokens.style, " with ", tokens.contrast, " contrast, ", tokens.mood, " mood"] })] }) })] }));
}
