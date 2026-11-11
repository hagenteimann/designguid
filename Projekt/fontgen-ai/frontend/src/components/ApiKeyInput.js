import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { isValidApiKey } from '../services/api';
export function ApiKeyInput({ onSubmit, isLoading = false }) {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [consented, setConsented] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!consented) {
            setError('You must acknowledge the security warning');
            return;
        }
        if (!isValidApiKey(apiKey)) {
            setError('Please enter a valid API key');
            return;
        }
        onSubmit(apiKey);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", children: [_jsxs("div", { className: "px-6 py-4 border-b border-neutral-200", children: [_jsx("h2", { className: "text-xl font-bold text-neutral-700", children: "API Configuration" }), _jsx("p", { className: "text-sm text-neutral-500 mt-1", children: "Configure your API key to start generating fonts" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "apiKey", className: "block text-sm font-medium text-neutral-600 mb-2", children: "API Key" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "apiKey", type: showKey ? 'text' : 'password', value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "sk-... or your custom API key", className: "w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all", disabled: isLoading }), _jsx("button", { type: "button", onClick: () => setShowKey(!showKey), className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-sm font-medium transition-colors", disabled: isLoading, children: showKey ? 'Hide' : 'Show' })] }), _jsx("p", { className: "text-xs text-neutral-500 mt-1", children: "Works with OpenAI, Claude, or custom endpoints" })] }), _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: "text-lg leading-none", children: "\u26A0\uFE0F" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-amber-900", children: "Security Warning" }), _jsx("p", { className: "text-xs text-amber-800 mt-1", children: "Your API key will be:" }), _jsxs("ul", { className: "text-xs text-amber-800 mt-1 space-y-1 list-disc list-inside", children: [_jsx("li", { children: "Stored in browser sessionStorage (cleared on close)" }), _jsx("li", { children: "Sent directly to the API with each request" }), _jsx("li", { children: "Exposed to this website and browser extensions" })] })] })] }), _jsx("p", { className: "text-xs text-amber-800 font-medium", children: "Use a spend-limited or temporary API key only." })] }), _jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: consented, onChange: (e) => setConsented(e.target.checked), disabled: isLoading, className: "mt-1 w-4 h-4 border border-neutral-300 rounded accent-primary-300 cursor-pointer" }), _jsx("span", { className: "text-sm text-neutral-600 flex-1", children: "I understand the security implications and will use a spend-limited API key" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700", children: error })), _jsx("button", { type: "submit", disabled: isLoading || !consented, className: "w-full bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "spinner", style: { borderWidth: '2px', width: '16px', height: '16px' } }), "Connecting..."] })) : ('Continue') })] }), _jsx("div", { className: "px-6 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg", children: _jsx("p", { className: "text-xs text-neutral-500 text-center", children: "Your key is never stored permanently and only used for this session." }) })] }) }));
}
