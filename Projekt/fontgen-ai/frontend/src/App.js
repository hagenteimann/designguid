import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiKeyInput } from './components/ApiKeyInput';
import { PromptBuilder } from './components/PromptBuilder';
import { PreviewPanel } from './components/PreviewPanel';
import { OutputPanel } from './components/OutputPanel';
import { generateFont, getEstimatedTime } from './services/api';
export function App() {
    const [tab, setTab] = useState('generate');
    const [apiKey, setApiKey] = useState(null);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [designTokens, setDesignTokens] = useState({
        weight: 'regular',
        contrast: 'medium',
        style: 'sans',
        mood: 'elegant'
    });
    const [generateTrigger, setGenerateTrigger] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(0);
    // Load API key from sessionStorage on mount
    useEffect(() => {
        const stored = sessionStorage.getItem('fontgen_api_key');
        if (stored) {
            setApiKey(stored);
            setHasApiKey(true);
        }
    }, []);
    // Update estimated time when design tokens change
    useEffect(() => {
        const time = getEstimatedTime(designTokens);
        setEstimatedTime(time);
    }, [designTokens]);
    // Query for font generation
    const { data: generationResult, isLoading, error } = useQuery({
        queryKey: ['generateFont', apiKey, prompt, designTokens, generateTrigger],
        queryFn: async () => {
            if (!apiKey || !prompt || !generateTrigger)
                return null;
            let progressUpdate = null;
            const result = await generateFont({
                prompt,
                apiKey,
                designTokens
            }, (update) => {
                progressUpdate = update;
            });
            return result;
        },
        enabled: !!apiKey && !!prompt && generateTrigger,
        staleTime: Infinity,
        retry: false
    });
    const handleApiKeySubmit = (key) => {
        setApiKey(key);
        sessionStorage.setItem('fontgen_api_key', key);
        setHasApiKey(true);
    };
    const handlePromptChange = (newPrompt, newTokens) => {
        setPrompt(newPrompt);
        setDesignTokens(newTokens);
    };
    const handleGenerate = () => {
        if (!prompt.trim()) {
            return;
        }
        setGenerateTrigger(true);
    };
    const handleResetApiKey = () => {
        sessionStorage.removeItem('fontgen_api_key');
        setApiKey(null);
        setHasApiKey(false);
        setGenerateTrigger(false);
    };
    const handleEditFont = () => {
        // Link to external glyph editor component (separate agent)
        alert('Glyph editor is in development. Redirect to editor component would go here.');
    };
    return (_jsxs("div", { className: "min-h-screen bg-neutral-100 flex flex-col", children: [!hasApiKey && _jsx(ApiKeyInput, { onSubmit: handleApiKeySubmit, isLoading: isLoading }), _jsx("header", { className: "bg-white border-b border-neutral-200 shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900", children: "FontGen AI" }), _jsx("p", { className: "text-sm text-neutral-600 mt-0.5", children: "Generate custom fonts with artificial intelligence" })] }), hasApiKey && (_jsx("button", { onClick: handleResetApiKey, className: "text-xs px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors", children: "Change API Key" }))] }) }), hasApiKey && (_jsxs("main", { className: "flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-4 sticky top-4", children: [_jsx("h2", { className: "text-lg font-bold text-neutral-900 mb-4", children: "Design Your Font" }), _jsx(PromptBuilder, { onPromptChange: handlePromptChange, isLoading: isLoading }), _jsx("button", { onClick: handleGenerate, disabled: !prompt.trim() || isLoading, className: "w-full mt-6 bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "spinner", style: { borderWidth: '2px', width: '18px', height: '18px' } }), "Generating... (", Math.round(estimatedTime / 1000), "s)"] })) : ('✨ Generate Font') }), error && (_jsxs("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-md", children: [_jsxs("p", { className: "text-sm text-red-700", children: [_jsx("span", { className: "font-medium", children: "Error:" }), " ", typeof error === 'object' && error && 'message' in error ? error.message : String(error)] }), _jsx("p", { className: "text-xs text-red-600 mt-1", children: "Check your API key and spend limits" })] })), generationResult?.status === 'error' && generationResult.error && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-md", children: _jsxs("p", { className: "text-sm text-red-700", children: [_jsx("span", { className: "font-medium", children: "Generation Failed:" }), " ", generationResult.error] }) })), generationResult?.status === 'success' && (_jsx("div", { className: "mt-4 p-3 bg-green-50 border border-green-200 rounded-md", children: _jsx("p", { className: "text-sm text-green-700", children: _jsx("span", { className: "font-medium", children: "\u2713 Font generated successfully!" }) }) }))] }) }), _jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsxs("div", { className: "flex gap-2 bg-white rounded-lg shadow p-1", children: [_jsx("button", { onClick: () => setTab('generate'), className: `flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'generate'
                                            ? 'bg-primary-300 text-white'
                                            : 'text-neutral-600 hover:bg-neutral-100'}`, children: "Preview" }), _jsx("button", { onClick: () => setTab('edit'), disabled: !generationResult?.fontUrl, className: `flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'edit'
                                            ? 'bg-primary-300 text-white'
                                            : generationResult?.fontUrl
                                                ? 'text-neutral-600 hover:bg-neutral-100'
                                                : 'text-neutral-400 cursor-not-allowed'}`, children: "Edit (Glyph Editor)" })] }), tab === 'generate' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden h-96", children: _jsx(PreviewPanel, { glyphs: generationResult?.glyphs, isLoading: isLoading, fontUrl: generationResult?.fontUrl }) }), _jsx("div", { className: "overflow-y-auto max-h-96", children: _jsx(OutputPanel, { qaStatus: generationResult?.qaStatus, fontUrl: generationResult?.fontUrl, isLoading: isLoading }) })] })), tab === 'edit' && (_jsxs("div", { className: "bg-white rounded-lg shadow p-8 text-center", children: [_jsx("p", { className: "text-neutral-600 mb-4", children: "The glyph editor is a separate component built by another agent." }), _jsx("button", { onClick: handleEditFont, className: "bg-primary-300 hover:bg-primary-400 text-white font-medium px-6 py-2 rounded-md transition-colors", children: "Open Glyph Editor" })] }))] })] })), _jsx("footer", { className: "bg-white border-t border-neutral-200 mt-auto", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 text-center text-xs text-neutral-600", children: [_jsx("p", { children: "FontGen AI \u2022 Powered by generative AI \u2022 Your API key is never stored permanently" }), _jsxs("p", { className: "mt-1", children: [_jsx("a", { href: "#", className: "hover:text-primary-300 transition-colors", children: "Privacy" }), " \u2022", _jsx("a", { href: "#", className: "hover:text-primary-300 transition-colors ml-2", children: "Terms" }), " \u2022", _jsx("a", { href: "#", className: "hover:text-primary-300 transition-colors ml-2", children: "About" })] })] }) })] }));
}
